import { getFødselsnummerValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateNavn } from '../validation/fieldValidation';
import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import { Person } from '../types/Person';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

const welcomingPageIsComplete = ({ harForståttRettigheterOgPlikter }: SoknadFormData) => {
    return harForståttRettigheterOgPlikter === true;
};

const opplysningerOmPleietrengendeIsComplete = (values: SoknadFormData, søker: Person): boolean =>
    welcomingPageIsComplete(values) &&
    values.pleietrengende !== undefined &&
    validateNavn(values.pleietrengende.etternavn) === undefined &&
    validateNavn(values.pleietrengende.fornavn) === undefined &&
    getFødselsnummerValidator({
        required: true,
        disallowedValues: [søker.fødselsnummer],
    })(values.pleietrengende.fødselsnummer) === undefined;

// TODO
const fraværStepIsComplete = (): boolean => true;
const arbeidssituasjonStepIsComplete = (): boolean => true;
const showFraværFraStep = ({ frilans_erFrilanser, selvstendig_erSelvstendigNæringsdrivende }: SoknadFormData) =>
    frilans_erFrilanser === YesOrNo.YES && selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
const fraværFraStepIsComplete = (): boolean => true;
const medlemskapStepIsComplete = (): boolean => true;

export const getAvailableSteps = (values: SoknadFormData, søker: Person): StepID[] => {
    const steps: StepID[] = [];

    if (welcomingPageIsComplete(values)) {
        steps.push(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE);
    }
    if (opplysningerOmPleietrengendeIsComplete(values, søker)) {
        steps.push(StepID.FRAVÆR);
    }
    if (fraværStepIsComplete()) {
        steps.push(StepID.ARBEIDSSITUASJON);
    }

    if (arbeidssituasjonStepIsComplete()) {
        showFraværFraStep(values) ? steps.push(StepID.FRAVÆR_FRA) : steps.push(StepID.MEDLEMSKAP);
    }
    if (showFraværFraStep(values) && fraværFraStepIsComplete()) {
        steps.push(StepID.MEDLEMSKAP);
    }
    if (medlemskapStepIsComplete()) {
        steps.push(StepID.OPPSUMMERING);
    }
    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
