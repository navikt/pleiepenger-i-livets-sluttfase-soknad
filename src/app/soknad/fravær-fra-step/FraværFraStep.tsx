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
            aktivitetFravær.push({
                aktivitet: formData[fieldName],
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
            value: Aktivitet.SELVSTENDIG_VIRKSOMHET,
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
                            <SoknadFormComponents.RadioGroup
                                name={fieldName as SoknadFormField}
                                legend={<FormattedMessage id="step.fravaerFra.dag.spm" values={{ dato }} />}
                                radios={[
                                    ...snFRadios(),
                                    ...arbeidsgiverRadios,
                                    {
                                        label: 'Alle', // TODO
                                        value: Aktivitet.ALLE,
                                    },
                                ]}
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
