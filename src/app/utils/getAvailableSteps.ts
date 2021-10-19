import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';

const welcomingPageIsComplete = ({ harForståttRettigheterOgPlikter }: SoknadFormData) => {
    return harForståttRettigheterOgPlikter === true;
};

const opplysningerOmGjeldendePersonIsComplete = (values: SoknadFormData): boolean => welcomingPageIsComplete(values);

export const getAvailableSteps = (values: SoknadFormData): StepID[] => {
    const steps: StepID[] = [];

    if (welcomingPageIsComplete(values)) {
        steps.push(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE_PERSON);
    }

    if (opplysningerOmGjeldendePersonIsComplete(values)) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
