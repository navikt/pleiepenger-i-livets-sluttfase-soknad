import { SoknadFormData } from '../types/SoknadFormData';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { skalBrukerSvareArbeidstid } from '../utils/stepUtils';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';

export enum StepID {
    'OPPLYSNINGER_OM_PLEIETRENGENDE' = 'opplysninger-om-pleietrengende',
    'TIDSROM' = 'tidsrom',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'ARBEIDSTID' = 'arbeidstid',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

export const getSoknadSteps = (formValues: SoknadFormData | undefined): StepID[] => {
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

    const steps: StepID[] = allSteps.filter((step) => step.included === true).map((step) => step.stepID);

    return steps;
};

export const getSoknadStepsConfig = (values: SoknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.SOKNAD);
