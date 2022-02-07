import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
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
import { getSøknadsperiodeFromFormData } from '../../utils/dates';

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
        const søknadsperiode = getSøknadsperiodeFromFormData(values);

        const fetchData = async (from: Date, to: Date): Promise<void> => {
            const maybeResponse: AxiosResponse<ArbeidsgiverResponse> | null = await getArbeidsgivere(from, to);
            const maybeArbeidsgivere: Arbeidsgiver[] | undefined = maybeResponse?.data?.organisasjoner;

            if (isArbeidsgivere(maybeArbeidsgivere)) {
                const updatedArbeidsforholds: ArbeidsforholdFormData[] = syncArbeidsforholdWithArbeidsgivere(
                    maybeArbeidsgivere,
                    values[SoknadFormField.arbeidsforhold]
                );
                setFieldValue(SoknadFormField.arbeidsforhold, updatedArbeidsforholds);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                appSentryLogger.logError(
                    `listeAvArbeidsgivereApiResponse invalid (SituasjonStepView). Response: ${JSON.stringify(
                        maybeResponse,
                        null,
                        4
                    )}`
                );
            }
        };

        if (søknadsperiode && doApiCalls) {
            fetchData(søknadsperiode.from, søknadsperiode.to);
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
            {!isLoading && values.arbeidsforhold.length > 0 && (
                <FormBlock>
                    <div className="arbeidsforhold-liste">
                        {values.arbeidsforhold.map((forhold, index) => (
                            <Box padBottom="xl" key={forhold.organisasjonsnummer}>
                                <ArbeidsforholdSituasjon
                                    parentFieldName={`${SoknadFormField.arbeidsforhold}.${index}`}
                                    organisasjonsnavn={forhold.navn}
                                />
                            </Box>
                        ))}
                    </div>
                </FormBlock>
            )}
            <Box margin="xxl" padBottom="l">
                <FrilansFormPart formValues={values} />
            </Box>

            <Box margin="l" padBottom="l">
                <SelvstendigNæringsdrivendeFormPart formValues={values} />
            </Box>
            {!showSubmitButton && (
                <FormBlock margin="l">
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.arbeidssituasjon.advarsel.ingenSituasjonValgt" />
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
