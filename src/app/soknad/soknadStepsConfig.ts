import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';

export enum StepID {
    'OPPLYSNINGER_OM_GJELDENDE_PERSON' = 'opplysninger-om-gjeldende-person',
    'OPPSUMMERING' = 'oppsummering',
}

const SoknadSteps: StepID[] = [StepID.OPPLYSNINGER_OM_GJELDENDE_PERSON, StepID.OPPSUMMERING];

export const soknadStepsConfig = soknadStepUtils.getStepsConfig(SoknadSteps, SoknadApplicationType.SOKNAD);
