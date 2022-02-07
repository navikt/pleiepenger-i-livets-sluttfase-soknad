import React from 'react';
import { FormattedMessage } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Aktivitet, AktivitetFravær } from '../../types/AktivitetFravær';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { getUtbetalingsdatoerFraFravær } from '../../utils/fraværUtils';
import { StepID } from '../soknadStepsConfig';
import SoknadFormStep from '../SoknadFormStep';
import SoknadFormComponents from '../SoknadFormComponents';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

const FraværFraStep = () => {
    const {
        values: {
            fraværDager,
            fraværPerioder,
            arbeidsforhold,
            selvstendig_erSelvstendigNæringsdrivende,
            frilans_erFrilanser,
        },
    } = useFormikContext<SoknadFormData>();
    const getFieldName = (dato: Date): string => {
        const key = dateToISOString(dato);
        return `${SoknadFormField.aktivitetFravær}_${key}`;
    };
    const utbetalingsdatoer = getUtbetalingsdatoerFraFravær(fraværPerioder, fraværDager);

    const onStepCleanup = (formData: SoknadFormData): SoknadFormData => {
        const aktivitetFravær: AktivitetFravær[] = [];
        utbetalingsdatoer.forEach((d) => {
            const fieldName = getFieldName(d);
            const cleanedAktiviteter = formData[fieldName].filter((a: string) => {
                if (a === Aktivitet.FRILANSER) {
                    return formData.frilans_erFrilanser === YesOrNo.YES;
                } else if (a === Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE) {
                    return formData.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
                } else
                    return formData.arbeidsforhold.some(
                        (forhold) =>
                            a === forhold.organisasjonsnummer && forhold.harHattFraværHosArbeidsgiver === YesOrNo.YES
                    );
            });
            aktivitetFravær.push({
                aktivitet: cleanedAktiviteter,
                dato: d,
            });
        });
        formData.aktivitetFravær = aktivitetFravær;
        return formData;
    };

    const arbeidsgiverRadios = arbeidsforhold
        .filter((forhold) => forhold.harHattFraværHosArbeidsgiver === YesOrNo.YES)
        .map((forhold) => ({ label: forhold.navn, value: forhold.organisasjonsnummer }));

    const snFRadios = () => {
        const frilans = {
            label: 'Frilanser',
            value: Aktivitet.FRILANSER,
        };
        const sn = {
            label: 'Selvstendig næringsdrivende',
            value: Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE,
        };

        if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES && frilans_erFrilanser === YesOrNo.YES) {
            return [frilans, sn];
        }
        if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES && frilans_erFrilanser === YesOrNo.NO) {
            return [sn];
        }
        if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.NO && frilans_erFrilanser === YesOrNo.YES) {
            return [frilans];
        }
        return [];
    };
    const aktivitetOptions = [...snFRadios(), ...arbeidsgiverRadios];
    return (
        <SoknadFormStep id={StepID.FRAVÆR_FRA} onStepCleanup={onStepCleanup}>
            <FormBlock>
                <CounsellorPanel>
                    <FormattedMessage id="step.fravaerFra.info" />
                </CounsellorPanel>
            </FormBlock>

            <FormBlock>
                {utbetalingsdatoer.map((date) => {
                    const fieldName = getFieldName(date);
                    const dato = dayjs(date).format('dddd D. MMM YYYY');
                    return (
                        <FormBlock key={fieldName}>
                            <SoknadFormComponents.CheckboxPanelGroup
                                name={fieldName as SoknadFormField}
                                legend={<FormattedMessage id="step.fravaerFra.dag.spm" values={{ dato }} />}
                                checkboxes={aktivitetOptions}
                                validate={(value) => {
                                    const error = getRequiredFieldValidator()(value);
                                    return error
                                        ? {
                                              key: 'validation.aktivitetFravær.noValue',
                                              values: { dato },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                            />
                        </FormBlock>
                    );
                })}
            </FormBlock>
        </SoknadFormStep>
    );
};

export default FraværFraStep;
