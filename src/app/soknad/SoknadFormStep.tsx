import * as React from 'react';
import { useIntl } from 'react-intl';
import { ApplikasjonHendelse, useAmplitudeInstance, useLogSidevisning } from '@navikt/sif-common-amplitude';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { persist, purge } from '../api/api';
import { getSøknadStepConfig } from './soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import { relocateToDinePleiepenger, relocateToSoknad } from '../utils/navigationUtils';
import { getStepTexts } from '../utils/stepUtils';
import SoknadFormComponents from './SoknadFormComponents';
import InvalidStepPage from '../pages/invalid-step-page/InvalidStepPage';
import Step, { StepProps } from '../components/step/Step';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    skipValidation?: boolean;
    onValidFormSubmit?: () => void;
    customErrorSummary?: () => React.ReactNode;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
}

type Props = FormikStepProps & Omit<StepProps, 'onAvbryt' | 'onFortsettSenere'>;

const SoknadFormStep = (props: Props) => {
    const formik = useFormikContext<SoknadFormData>();

    const intl = useIntl();
    const {
        children,
        onValidFormSubmit,
        showButtonSpinner,
        buttonDisabled,
        id,
        customErrorSummary,
        showSubmitButton = true,
    } = props;
    const stepConfig = getSøknadStepConfig(formik.values);
    useLogSidevisning(id);
    const { logHendelse } = useAmplitudeInstance();

    const handleAvbrytSøknad = async () => {
        await purge();
        await logHendelse(ApplikasjonHendelse.avbryt);
        relocateToSoknad();
    };

    const handleAvsluttOgFortsettSenere = async () => {
        /** Mellomlagring lagrer forrige steg, derfor må dette hentes ut her **/
        const prevStep = stepConfig[id].prevStep;
        await persist(formik.values, prevStep);
        await logHendelse(ApplikasjonHendelse.fortsettSenere);
        relocateToDinePleiepenger();
    };

    if (stepConfig === undefined || stepConfig[id] === undefined || stepConfig[id].included === false) {
        return <InvalidStepPage stepId={id} />;
    }

    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step
            stepConfig={stepConfig}
            onFortsettSenere={handleAvsluttOgFortsettSenere}
            onAvbryt={handleAvbrytSøknad}
            {...props}>
            <SoknadFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                cleanup={props.onStepCleanup}
                formErrorHandler={getIntlFormErrorHandler(intl, 'validation')}
                formFooter={
                    <>
                        {customErrorSummary && <FormBlock>{customErrorSummary()}</FormBlock>}
                        {showSubmitButton && (
                            <FormBlock>
                                <Knapp
                                    type="hoved"
                                    htmlType="submit"
                                    className={'step__button'}
                                    spinner={showButtonSpinner || false}
                                    disabled={buttonDisabled || false}
                                    aria-label={texts.nextButtonAriaLabel}>
                                    {texts.nextButtonLabel}
                                </Knapp>
                            </FormBlock>
                        )}
                    </>
                }>
                {children}
            </SoknadFormComponents.Form>
        </Step>
    );
};

export default SoknadFormStep;
