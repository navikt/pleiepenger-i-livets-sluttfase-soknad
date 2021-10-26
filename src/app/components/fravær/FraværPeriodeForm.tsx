import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    getDateRangeValidator,
    ValidateDateError,
    ValidateDateRangeError,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Systemtittel } from 'nav-frontend-typografi';
import { isFraværPeriode, mapFormValuesToFraværPeriode, mapFraværPeriodeToFormValues } from './fraværUtilities';
import {
    FraværFieldValidationErrors,
    validateErSammeÅr,
    validateFraOgMedForCollision,
    validateFraværPeriodeCollision,
    validateNotHelgedag,
    validateTilOgMedForCollision,
} from './fraværValidationUtils';
import { FraværPeriode, FraværPeriodeFormValues } from './types';
import AlertStripe from 'nav-frontend-alertstriper';

// TODO
export const handleDateRangeValidationError = (
    error: ValidateDateError | ValidateDateRangeError | ValidateRequiredFieldError | undefined,
    minDate: Date | undefined,
    maxDate: Date | undefined
): ValidationError | undefined => {
    if (minDate && error === ValidateDateError.dateIsBeforeMin) {
        return {
            key: error,
            values: { dato: prettifyDate(minDate) },
        };
    }
    if (maxDate && error === ValidateDateError.dateIsAfterMax) {
        return {
            key: error,
            values: { dato: prettifyDate(maxDate) },
        };
    }
    return error;
};

export interface FraværPeriodeFormLabels {
    tittel: string;
    tidsrom: string;
    fom: string;
    tom: string;
    ok: string;
    avbryt: string;
}

interface Props {
    fraværPeriode?: Partial<FraværPeriode>;
    periodeDescription?: JSX.Element;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillat?: boolean;
    begrensTilSammeÅr?: boolean;
    begrensTilSammeÅrAlertStripeTekst?: string;
    headerContent?: JSX.Element;
    onSubmit: (values: FraværPeriode) => void;
    onCancel: () => void;
}

enum FraværPeriodeFormFields {
    fraOgMed = 'fraOgMed',
    tilOgMed = 'tilOgMed',
}

export const FraværPeriodeFormErrors = {
    [FraværPeriodeFormFields.fraOgMed]: {
        [ValidateDateError.dateHasNoValue]: 'fraværPeriodeForm.fraOgMed.dateHasNoValue',
        [ValidateDateError.dateIsAfterMax]: 'fraværPeriodeForm.fraOgMed.dateIsAfterMax',
        [ValidateDateError.dateIsBeforeMin]: 'fraværPeriodeForm.fraOgMed.dateIsBeforeMin',
        [ValidateDateError.dateHasInvalidFormat]: 'fraværPeriodeForm.fraOgMed.dateHasInvalidFormat',
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'fraværPeriodeForm.fraOgMed.fromDateIsAfterToDate',
        [FraværFieldValidationErrors.er_helg]: 'fraværPeriodeForm.fraOgMed.er_helg',
        [FraværFieldValidationErrors.fra_og_til_er_ulike_år]: 'fraværPeriodeForm.fraOgMed.fra_og_til_er_ulike_år',
        [FraværFieldValidationErrors.fra_dato_kolliderer_med_annet_fravær]:
            'fraværPeriodeForm.fraOgMed.fra_dato_kolliderer_med_annet_fravær',
    },
    [FraværPeriodeFormFields.tilOgMed]: {
        [ValidateDateError.dateHasNoValue]: 'fraværPeriodeForm.tilOgMed.dateHasNoValue',
        [ValidateDateError.dateIsAfterMax]: 'fraværPeriodeForm.tilOgMed.dateIsAfterMax',
        [ValidateDateError.dateIsBeforeMin]: 'fraværPeriodeForm.tilOgMed.dateIsBeforeMin',
        [ValidateDateError.dateHasInvalidFormat]: 'fraværPeriodeForm.tilOgMed.dateHasInvalidFormat',
        [ValidateDateRangeError.toDateIsBeforeFromDate]: 'fraværPeriodeForm.tilOgMed.toDateIsBeforeFromDate',
        [FraværFieldValidationErrors.er_helg]: 'fraværPeriodeForm.tilOgMed.er_helg',
        [FraværFieldValidationErrors.fra_og_til_er_ulike_år]: 'fraværPeriodeForm.tilOgMed.fra_og_til_er_ulike_år',
        [FraværFieldValidationErrors.til_dato_kolliderer_med_annet_fravær]:
            'fraværPeriodeForm.tilOgMed.til_dato_kolliderer_med_annet_fravær',
    },
    ['fraOgMed_tilOgMed']: {
        [FraværFieldValidationErrors.dager_overlapper_med_andre_dager]:
            'fraværPeriodeForm.periode.dager_overlapper_med_andre_dager',
    },
};

export const FraværPeriodeFormName = 'fraværPeriodeForm';

const Form = getTypedFormComponents<FraværPeriodeFormFields, FraværPeriodeFormValues, ValidationError>();

const FraværPeriodeForm = ({
    fraværPeriode = {},
    periodeDescription,
    maxDate,
    minDate,
    dateRangesToDisable,
    helgedagerIkkeTillat,
    headerContent,
    begrensTilSammeÅr,
    begrensTilSammeÅrAlertStripeTekst,
    onSubmit,
    onCancel,
}: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: FraværPeriodeFormValues) => {
        const fraværPeriodeToSubmit = mapFormValuesToFraværPeriode(formValues, fraværPeriode.id);
        if (isFraværPeriode(fraværPeriodeToSubmit)) {
            onSubmit(fraværPeriodeToSubmit);
        } else {
            throw new Error('FraværPeriodeForm: Formvalues is not a valid FraværPeriode on submit.');
        }
    };

    const formLabels: FraværPeriodeFormLabels = {
        ok: intlHelper(intl, 'fravær.form.felles.ok'),
        avbryt: intlHelper(intl, 'fravær.form.felles.avbryt'),
        tittel: intlHelper(intl, 'fravær.form.periode.tittel'),
        tidsrom: intlHelper(intl, 'fravær.form.periode.tidsrom'),
        fom: intlHelper(intl, 'fravær.form.periode.fom'),
        tom: intlHelper(intl, 'fravær.form.periode.tom'),
    };

    const disabledDateRanges = dateRangesToDisable
        ? dateRangesToDisable.filter((range) => {
              const { fraOgMed, tilOgMed } = fraværPeriode;
              return !(
                  fraOgMed &&
                  tilOgMed &&
                  dayjs(fraOgMed).isSame(range.from, 'day') &&
                  dayjs(tilOgMed).isSame(range.to, 'day')
              );
          })
        : undefined;

    return (
        <>
            <Form.FormikWrapper
                initialValues={mapFraværPeriodeToFormValues(fraværPeriode)}
                onSubmit={onFormikSubmit}
                renderForm={(formik) => {
                    const { fraOgMed, tilOgMed } = formik.values;
                    const fromDate: Date | undefined = ISOStringToDate(fraOgMed);
                    const toDate: Date | undefined = ISOStringToDate(tilOgMed);
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'fraværPeriodeForm')}>
                            <Systemtittel tag="h1">{formLabels.tittel}</Systemtittel>
                            {headerContent && <Box margin="l">{headerContent}</Box>}
                            <FormBlock>
                                <Form.DateIntervalPicker
                                    legend={formLabels.tidsrom}
                                    description={periodeDescription}
                                    validate={() => {
                                        const err = validateFraværPeriodeCollision(
                                            fromDate,
                                            toDate,
                                            disabledDateRanges
                                        );
                                        if (err) {
                                            return {
                                                key: FraværPeriodeFormErrors.fraOgMed_tilOgMed
                                                    .dager_overlapper_med_andre_dager,
                                                keepKeyUnaltered: true,
                                            };
                                        }
                                        return undefined;
                                    }}
                                    fromDatepickerProps={{
                                        label: formLabels.fom,
                                        name: FraværPeriodeFormFields.fraOgMed,
                                        fullscreenOverlay: true,
                                        minDate: minDate,
                                        maxDate: toDate || maxDate,
                                        disableWeekend: helgedagerIkkeTillat || false,
                                        disabledDateRanges,
                                        dayPickerProps: {
                                            initialMonth:
                                                fromDate || toDate || dayjs(dateToday).isAfter(maxDate)
                                                    ? maxDate
                                                    : dateToday,
                                        },
                                        validate: getFromDateValidator({
                                            begrensTilSammeÅr,
                                            minDate,
                                            maxDate,
                                            helgedagerIkkeTillat,
                                            disabledDateRanges,
                                            toDate,
                                            tilOgMed,
                                        }),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(FraværPeriodeFormFields.fraOgMed);
                                                formik.validateField(FraværPeriodeFormFields.tilOgMed);
                                            });
                                        },
                                    }}
                                    toDatepickerProps={{
                                        label: formLabels.tom,
                                        name: FraværPeriodeFormFields.tilOgMed,
                                        fullscreenOverlay: true,
                                        minDate: fromDate || minDate,
                                        maxDate,
                                        disableWeekend: helgedagerIkkeTillat || false,
                                        disabledDateRanges,
                                        dayPickerProps: {
                                            initialMonth:
                                                toDate || fromDate || dayjs(dateToday).isAfter(maxDate)
                                                    ? maxDate
                                                    : dateToday,
                                        },
                                        validate: getToDateValidator({
                                            begrensTilSammeÅr,
                                            disabledDateRanges,
                                            fraOgMed,
                                            fromDate,
                                            helgedagerIkkeTillat,
                                            maxDate,
                                            minDate,
                                        }),
                                        onChange: () => {
                                            setTimeout(() => {
                                                formik.validateField(FraværPeriodeFormFields.fraOgMed);
                                                formik.validateField(FraværPeriodeFormFields.tilOgMed);
                                            });
                                        },
                                    }}
                                />
                                {begrensTilSammeÅr &&
                                    begrensTilSammeÅrAlertStripeTekst &&
                                    validateErSammeÅr(fraOgMed, tilOgMed) && (
                                        <AlertStripe type="advarsel">{begrensTilSammeÅrAlertStripeTekst}</AlertStripe>
                                    )}
                            </FormBlock>
                        </Form.Form>
                    );
                }}
            />
        </>
    );
};

const getFromDateValidator =
    ({
        helgedagerIkkeTillat,
        begrensTilSammeÅr,
        tilOgMed,
        toDate,
        disabledDateRanges,
        minDate,
        maxDate,
    }: {
        helgedagerIkkeTillat?: boolean;
        begrensTilSammeÅr?: boolean;
        tilOgMed?: string;
        toDate?: Date;
        disabledDateRanges?: DateRange[];
        minDate?: Date;
        maxDate?: Date;
    }) =>
    (value: string | undefined): ValidationError | undefined => {
        if (helgedagerIkkeTillat && validateNotHelgedag(value)) {
            return {
                key: FraværPeriodeFormErrors.fraOgMed.er_helg,
                keepKeyUnaltered: true,
            };
        }
        if (begrensTilSammeÅr && validateErSammeÅr(value, tilOgMed)) {
            return {
                key: FraværPeriodeFormErrors.fraOgMed.fra_og_til_er_ulike_år,
                keepKeyUnaltered: true,
            };
        }
        if (validateFraOgMedForCollision(toDate, disabledDateRanges)) {
            return {
                key: FraværPeriodeFormErrors.fraOgMed.fra_dato_kolliderer_med_annet_fravær,
                keepKeyUnaltered: true,
            };
        }
        const dateError = getDateRangeValidator({
            required: true,
            min: minDate,
            max: maxDate,
            toDate,
        }).validateFromDate(value);

        return handleDateRangeValidationError(dateError, minDate, maxDate);
    };

const getToDateValidator =
    ({
        helgedagerIkkeTillat,
        begrensTilSammeÅr,
        fraOgMed,
        fromDate,
        disabledDateRanges,
        minDate,
        maxDate,
    }: {
        helgedagerIkkeTillat?: boolean;
        begrensTilSammeÅr?: boolean;
        fraOgMed?: string;
        fromDate?: Date;
        disabledDateRanges?: DateRange[];
        minDate?: Date;
        maxDate?: Date;
    }) =>
    (value: string | undefined) => {
        if (helgedagerIkkeTillat && validateNotHelgedag(value)) {
            return {
                key: FraværPeriodeFormErrors.tilOgMed.er_helg,
                keepKeyUnaltered: true,
            };
        }
        if (begrensTilSammeÅr && validateErSammeÅr(fraOgMed, value)) {
            return {
                key: FraværPeriodeFormErrors.tilOgMed.fra_og_til_er_ulike_år,
                keepKeyUnaltered: true,
            };
        }
        if (validateTilOgMedForCollision(fromDate, disabledDateRanges)) {
            return {
                key: FraværPeriodeFormErrors.tilOgMed.til_dato_kolliderer_med_annet_fravær,
                keepKeyUnaltered: true,
            };
        }
        const dateError = getDateRangeValidator({
            required: true,
            min: minDate,
            max: maxDate,
            fromDate,
        }).validateToDate(value);
        return handleDateRangeValidationError(dateError, minDate, maxDate);
    };
export default FraværPeriodeForm;
