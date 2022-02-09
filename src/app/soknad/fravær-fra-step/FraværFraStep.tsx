import React from 'react';
import { FormattedMessage } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
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
            fraværPerioder,
            arbeidsforhold,
            selvstendig_erSelvstendigNæringsdrivende,
            frilans_erFrilanser,
            harStønadFraNav,
        },
    } = useFormikContext<SoknadFormData>();

    const getFieldName = (dato: Date): string => {
        const key = dateToISOString(dato);
        return `${SoknadFormField.aktivitetFravær}_${key}`;
    };
    const utbetalingsdatoer = getUtbetalingsdatoerFraFravær(fraværPerioder);

    const onStepCleanup = (formData: SoknadFormData): SoknadFormData => {
        const aktivitetFravær: AktivitetFravær[] = [];
        utbetalingsdatoer.forEach((d) => {
            const fieldName = getFieldName(d);

            const cleanedAktiviteter: string[] = formData[fieldName]
                ? formData[fieldName].filter((a: string) => {
                      if (a === Aktivitet.FRILANSER) {
                          return formData.frilans_erFrilanser === YesOrNo.YES;
                      } else if (a === Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE) {
                          return formData.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
                      } else if (a === Aktivitet.STØNAD_FRA_NAV) {
                          return formData.harStønadFraNav === YesOrNo.YES;
                      } else
                          return formData.arbeidsforhold.some(
                              (forhold) =>
                                  a === forhold.organisasjonsnummer &&
                                  forhold.harHattFraværHosArbeidsgiver === YesOrNo.YES
                          );
                  })
                : [];
            cleanedAktiviteter.length > 0 &&
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
        const frilans = () => {
            return frilans_erFrilanser === YesOrNo.YES ? [{ label: 'Frilanser', value: Aktivitet.FRILANSER }] : [];
        };

        const sn = () => {
            return selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES
                ? [{ label: 'Selvstendig næringsdrivende', value: Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE }]
                : [];
        };

        const stønadFraNav = () => {
            return harStønadFraNav === YesOrNo.YES
                ? [{ label: 'Stønad fra NAV', value: Aktivitet.STØNAD_FRA_NAV }]
                : [];
        };

        return [...frilans(), ...sn(), ...stønadFraNav()];
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
                                validate={(value: string[]) => {
                                    const cleanedValue = value
                                        ? value.filter((s) => {
                                              return aktivitetOptions.find((option) => option.value === s);
                                          })
                                        : [];

                                    const error = getListValidator({ required: true })(cleanedValue);
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
