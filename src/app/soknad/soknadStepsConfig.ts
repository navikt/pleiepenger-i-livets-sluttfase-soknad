import { SoknadFormData } from 'app/types/SoknadFormData';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { skalBrukerSvareArbeidstid } from '../utils/stepUtils';
import { getSøknadRoute } from '../utils/routeUtils';

export enum StepID {
    'OPPLYSNINGER_OM_PLEIETRENGENDE' = 'opplysninger-om-pleietrengende',
    'TIDSROM' = 'tidsrom',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'ARBEIDSTID' = 'arbeidstid',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
    nextButtonAriaLabel?: string;
}

export interface StepItemConfigInterface extends StepConfigItemTexts {
    stepNumber: number;
    prevStep?: StepID;
    nextStep?: StepID;
    backLinkHref?: string;
    included: boolean;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: stepId === StepID.OPPSUMMERING ? 'step.sendButtonLabel' : 'step.nextButtonLabel',
        nextButtonAriaLabel: stepId === StepID.OPPSUMMERING ? 'step.sendButtonAriaLabel' : 'step.nextButtonAriaLabel',
    };
};

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

export const getSøknadStepConfig = (formValues: SoknadFormData | undefined): StepConfigInterface => {
    const søknadsperiode = formValues ? getSøknadsperiodeFromFormData(formValues) : undefined;
    const includeArbeidstid =
        søknadsperiode && formValues ? skalBrukerSvareArbeidstid(søknadsperiode, formValues) : false;

    const allSteps: ConfigStepHelperType[] = [
        { stepID: StepID.OPPLYSNINGER_OM_PLEIETRENGENDE, included: true },
        { stepID: StepID.TIDSROM, included: true },
        { stepID: StepID.ARBEIDSSITUASJON, included: true },
        { stepID: StepID.ARBEIDSTID, included: includeArbeidstid },
        { stepID: StepID.MEDLEMSKAP, included: true },
        { stepID: StepID.OPPSUMMERING, included: true },
    ];

    const includedSteps = allSteps.filter((s) => s.included);

    const getNextStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx > -1 && idx < includedSteps.length - 1 ? includedSteps[idx + 1].stepID : undefined;
    };

    const getPreviousStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx >= 1 ? includedSteps[idx - 1].stepID : undefined;
    };

    const config: StepConfigInterface = {};
    let includedStepIdx = 0;
    allSteps.forEach(({ stepID, included }) => {
        const nextStep = getNextStep(stepID);
        const prevStep = getPreviousStep(stepID);
        let backLinkHref;
        try {
            backLinkHref = prevStep ? getSøknadRoute(prevStep) : undefined;
        } catch (e) {
            console.log(e);
        }

        config[stepID] = {
            ...getStepConfigItemTextKeys(stepID),
            stepNumber: includedStepIdx,
            nextStep,
            prevStep,
            backLinkHref,
            included,
        };
        includedStepIdx = included ? includedStepIdx + 1 : includedStepIdx;
    });
    return config;
};

export const getBackLinkFromNotIncludedStep = (stepId: StepID): string | undefined => {
    if (stepId === StepID.ARBEIDSTID) {
        return getSøknadRoute(StepID.ARBEIDSSITUASJON);
    }
    return undefined;
};
export interface StepConfigProps {
    onValidSubmit: () => void;
}
