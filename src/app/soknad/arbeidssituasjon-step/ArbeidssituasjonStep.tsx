import * as React from 'react';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import FrilansFormPart from './components/FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './components/SelvstendigNæringsdrivendeFormPart';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { Arbeidsgiver, ArbeidsgiverResponse, isArbeidsgivere } from '../../types/Arbeidsgiver';
import ArbeidsforholdSituasjon from '../../components/formik-arbeidsforhold/ArbeidsforholdSituasjon';
import { cleanupArbeidssituasjonStep } from './cleanupArbeidssituasjonStep';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getArbeidsgivere, syncArbeidsforholdWithArbeidsgivere } from '../../utils/arbeidsforholdUtils';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdTypes';
import appSentryLogger from '../../utils/appSentryLogger';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';

const shouldShowSubmitButton = (søknadFormData: SoknadFormData): boolean => {
    const erFrilanser: YesOrNo = søknadFormData[SoknadFormField.frilans_erFrilanser];
    const erSelvstendigNæringsdrivende: YesOrNo | undefined =
        søknadFormData[SoknadFormField.selvstendig_erSelvstendigNæringsdrivende];
    const erArbeidstaker =
        søknadFormData.arbeidsforhold.length > 0 &&
        søknadFormData.arbeidsforhold.some((forhold) => forhold.harHattFraværHosArbeidsgiver === YesOrNo.YES);
    return !(erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO) || erArbeidstaker;
};

const ArbeidssituasjonStep = () => {
    const { values } = useFormikContext<SoknadFormData>();
    const { setFieldValue } = useFormikContext<SoknadFormData>();
    const showSubmitButton = shouldShowSubmitButton(values);
    const [isLoading, setIsLoading] = useState(true);
    const [doApiCalls, setDoApiCalls] = useState(true);

    useEffect(() => {
        const søknadsperiode = getPeriodeBoundaries(values.fraværPerioder);

        const fetchData = async (from: Date, to: Date): Promise<void> => {
            const response: AxiosResponse<ArbeidsgiverResponse> | null = await getArbeidsgivere(from, to);
            const arbeidsgivere: Arbeidsgiver[] | undefined = response?.data?.organisasjoner;

            if (isArbeidsgivere(arbeidsgivere)) {
                const updatedArbeidsforholds: ArbeidsforholdFormData[] = syncArbeidsforholdWithArbeidsgivere(
                    arbeidsgivere,
                    values[SoknadFormField.arbeidsforhold]
                );

                setFieldValue(SoknadFormField.arbeidsforhold, updatedArbeidsforholds);
                setIsLoading(false);
            } else {
                setIsLoading(false);

                appSentryLogger.logError(
                    `listeAvArbeidsgivereApiResponse invalid (SituasjonStepView). Response: ${JSON.stringify(
                        response,
                        null,
                        4
                    )}`
                );
            }
        };

        if (søknadsperiode.min && søknadsperiode.max && doApiCalls) {
            fetchData(søknadsperiode.min, søknadsperiode.max);
            setDoApiCalls(false);
        }
    }, [doApiCalls, values, setFieldValue]);

    return (
        <SoknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            showSubmitButton={!isLoading && showSubmitButton}
            onStepCleanup={() => cleanupArbeidssituasjonStep(values)}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.arbeidssituasjon.info.1" />
                </p>
            </CounsellorPanel>

            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
                    <LoadingSpinner type="XXL" />
                </div>
            )}

            {!isLoading &&
                values.arbeidsforhold.length > 0 &&
                values.arbeidsforhold.map((forhold, index) => (
                    <FormBlock key={forhold.organisasjonsnummer}>
                        <ArbeidsforholdSituasjon
                            parentFieldName={`${SoknadFormField.arbeidsforhold}.${index}`}
                            organisasjonsnavn={forhold.navn}
                        />
                    </FormBlock>
                ))}

            <FormBlock>
                <FrilansFormPart formValues={values} />
            </FormBlock>

            <FormBlock>
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </FormBlock>

            {!showSubmitButton && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
