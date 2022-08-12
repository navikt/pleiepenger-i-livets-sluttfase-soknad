import { DateRange } from '@navikt/sif-common-formik/lib';
import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import {
    arbeidssituasjonStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmPleietrengendeStepAvailable,
    opplysningerOmTidsromStepAvailable,
    oppsummeringStepAvailable,
    arbeidIPeriodeStepIsAvailable,
    skalBrukerSvareArbeidstid,
} from './stepUtils';

export const getAvailableSteps = (values: SoknadFormData, søknadsperiode?: DateRange): StepID[] => {
    const steps: StepID[] = [];

    if (opplysningerOmPleietrengendeStepAvailable(values)) {
        steps.push(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE);
    }

    if (opplysningerOmTidsromStepAvailable(values)) {
        steps.push(StepID.TIDSROM);
    }

    if (arbeidssituasjonStepAvailable(values)) {
        steps.push(StepID.ARBEIDSSITUASJON);
    }

    if (arbeidIPeriodeStepIsAvailable(values) && søknadsperiode && skalBrukerSvareArbeidstid(søknadsperiode, values)) {
        steps.push(StepID.ARBEIDSTID);
    }
    if (medlemskapStepAvailable(values)) {
        steps.push(StepID.MEDLEMSKAP);
    }
    if (oppsummeringStepAvailable(values)) {
        steps.push(StepID.OPPSUMMERING);
    }

    return steps;
};
