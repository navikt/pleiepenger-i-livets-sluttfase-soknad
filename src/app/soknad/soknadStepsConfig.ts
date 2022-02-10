import { SoknadApplicationType, SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { SoknadFormData } from '../types/SoknadFormData';
import { showFraværFraStep } from '../utils/getAvailableSteps';

export enum StepID {
    'OPPLYSNINGER_OM_PLEIETRENGENDE' = 'opplysninger-om-pleietrengende',
    'FRAVÆR' = 'fravær',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'FRAVÆR_FRA' = 'fravaerFra',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

const getSoknadSteps = (values: SoknadFormData): StepID[] => {
    // TODO Arbeidsgiver sjekk
    const inkluderFraværFraStep = showFraværFraStep(values);
    return [
        StepID.OPPLYSNINGER_OM_PLEIETRENGENDE,
        StepID.FRAVÆR,
        StepID.ARBEIDSSITUASJON,
        ...(inkluderFraværFraStep ? [StepID.FRAVÆR_FRA] : []),
        StepID.MEDLEMSKAP,
        StepID.OPPSUMMERING,
    ];
};
export const getSoknadStepsConfig = (values: SoknadFormData): SoknadStepsConfig<StepID> =>
    soknadStepUtils.getStepsConfig(getSoknadSteps(values), SoknadApplicationType.SOKNAD);
