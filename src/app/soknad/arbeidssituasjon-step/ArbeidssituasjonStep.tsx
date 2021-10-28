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
import { ArbeidsgiverResponse } from '../../types/Arbeidsgiver';
import ArbeidsforholdSituasjon from '../../components/formik-arbeidsforhold/ArbeidsforholdSituasjon';
import { cleanupArbeidssituasjonStep } from './cleanupArbeidssituasjonStep';

interface Props {
    arbeidsgivere: ArbeidsgiverResponse;
}

const shouldShowSubmitButton = (søknadFormData: SoknadFormData): boolean => {
    const erFrilanser: YesOrNo = søknadFormData[SoknadFormField.frilans_erFrilanser];
    const erSelvstendigNæringsdrivende: YesOrNo | undefined =
        søknadFormData[SoknadFormField.selvstendig_erSelvstendigNæringsdrivende];

    return !(erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO);
};

const ArbeidssituasjonStep = ({ arbeidsgivere }: Props) => {
    const { values } = useFormikContext<SoknadFormData>();
    const showSubmitButton = shouldShowSubmitButton(values);
    console.log(values);
    /*values.arbeidsforhold = arbeidsgivere.organisasjoner.map((arbeidsgiver) => ({
        navn: arbeidsgiver.navn,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        harHattFraværHosArbeidsgiver: YesOrNo.UNANSWERED,
    }));*/
    return (
        <SoknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            showSubmitButton={showSubmitButton}
            onStepCleanup={() => cleanupArbeidssituasjonStep(values, arbeidsgivere.organisasjoner)}>
            <CounsellorPanel>
                <p>
                    <FormattedHtmlMessage id="step.arbeidssituasjon.info.1" />
                </p>
            </CounsellorPanel>
            {arbeidsgivere.organisasjoner.length > 0 && (
                <FormBlock>
                    <div className="arbeidsforhold-liste">
                        {arbeidsgivere.organisasjoner.map((forhold, index) => (
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
