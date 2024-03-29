import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import StepSubmitButton from '@navikt/sif-common-soknad/lib/soknad-step/step-submit-button/StepSubmitButton';
import Step from '@navikt/sif-common-soknad/lib/soknad-step/step/Step';
import { SoknadFormData } from '../types/SoknadFormData';
import { useSoknadContext } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import { StepID } from './soknadStepsConfig';
import { useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';

export interface SoknadFormStepBeforeValidSubmitProps {
    onBeforeValidSubmit?: () => Promise<boolean>;
}
interface Props {
    id: StepID;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    onSendSoknad?: () => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    includeValidationSummary?: boolean;
    buttonDisabled?: boolean;
    children: React.ReactNode;
}

const SoknadFormStep: React.FC<Props & SoknadFormStepBeforeValidSubmitProps> = ({
    id,
    onStepCleanup,
    onSendSoknad,
    onBeforeValidSubmit,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    includeValidationSummary = true,
    buttonDisabled,
}) => {
    const intl = useIntl();
    const { soknadStepsConfig, resetSoknad, gotoNextStepFromStep, continueSoknadLater } = useSoknadContext();
    const stepConfig = soknadStepsConfig[id];
    const texts = soknadStepUtils.getStepTexts(intl, stepConfig);

    useLogSidevisning(id);

    const onValidSubmit = async () => {
        if (onSendSoknad) {
            onSendSoknad();
        }
        if (onBeforeValidSubmit) {
            if (await onBeforeValidSubmit()) {
                gotoNextStepFromStep(id);
            }
        } else {
            gotoNextStepFromStep(id);
        }
    };

    return (
        <Step
            bannerTitle={intlHelper(intl, 'application.title')}
            stepTitle={texts.stepTitle}
            pageTitle={texts.pageTitle}
            backLinkHref={stepConfig.backLinkHref}
            steps={soknadStepUtils.getStepIndicatorStepsFromConfig(soknadStepsConfig, intl)}
            activeStepId={id}
            onCancel={resetSoknad}
            onContinueLater={continueSoknadLater ? () => continueSoknadLater(id) : undefined}>
            <SoknadFormComponents.Form
                includeButtons={false}
                includeValidationSummary={includeValidationSummary}
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
                onValidSubmit={onValidSubmit}
                formErrorHandler={intlFormErrorHandler(intl, 'validation')}>
                {children}
                {showSubmitButton && (
                    <Box textAlignCenter={true} margin="xl">
                        <StepSubmitButton disabled={buttonDisabled} showSpinner={showButtonSpinner}>
                            {texts.nextButtonLabel}
                        </StepSubmitButton>
                    </Box>
                )}
            </SoknadFormComponents.Form>
        </Step>
    );
};

export default SoknadFormStep;
