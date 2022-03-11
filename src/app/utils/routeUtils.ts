import RouteConfig from '../config/routeConfig';
import { getSøknadStepConfig, StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import {
    arbeidssituasjonStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmPleietrengendeStepAvailable,
    opplysningerOmTidsromStepAvailable,
    oppsummeringStepAvailable,
    arbeidIPeriodeStepIsAvailable,
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: SoknadFormData): string | undefined => {
    const stepConfig = getSøknadStepConfig(formData);
    return stepConfig[stepId] && stepConfig[stepId].included === true
        ? getSøknadRoute(stepConfig[stepId].nextStep)
        : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SoknadFormData, søknadHasBeenSent?: boolean) => {
    switch (path) {
        case StepID.OPPLYSNINGER_OM_PLEIETRENGENDE:
            return opplysningerOmPleietrengendeStepAvailable(values);
        case StepID.TIDSROM:
            return opplysningerOmTidsromStepAvailable(values);
        case StepID.ARBEIDSSITUASJON:
            return arbeidssituasjonStepAvailable(values);
        case StepID.ARBEIDSTID:
            return arbeidIPeriodeStepIsAvailable(values);
        case StepID.MEDLEMSKAP:
            return medlemskapStepAvailable(values);
        case StepID.OPPSUMMERING:
            return oppsummeringStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE:
            return søknadHasBeenSent === true;
    }
    return false;
};
