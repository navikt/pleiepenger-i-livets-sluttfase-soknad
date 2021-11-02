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
    validateNavn(values.pleietrengende.navn) === undefined &&
    getFødselsnummerValidator({
        required: true,
        disallowedValues: [søker.fødselsnummer],
    })(values.pleietrengende.norskIdentitetsnummer) === undefined;

// TODO
const fraværStepIsComplete = (): boolean => true;
const arbeidssituasjonStepIsComplete = (): boolean => true;

export const showFraværFraStep = ({
    frilans_erFrilanser,
    selvstendig_erSelvstendigNæringsdrivende,
    arbeidsforhold,
}: SoknadFormData) => {
    // console.log(arbeidsforhold.some((f) => f.harHattFraværHosArbeidsgiver === YesOrNo.YES));
    // console.log(frilans_erFrilanser === YesOrNo.YES || selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES);
    /*console.log(
        (frilans_erFrilanser === YesOrNo.YES || selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES) &&
            arbeidsforhold.some((f) => f.harHattFraværHosArbeidsgiver === YesOrNo.YES)
    );*/
    let count = 0;
    if (frilans_erFrilanser === YesOrNo.YES) count++;
    if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES) count++;
    count += arbeidsforhold.filter((f) => f.harHattFraværHosArbeidsgiver === YesOrNo.YES).length;
    console.log(count);
    return count > 1;
};

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

/*export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};*/
