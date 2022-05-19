import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { StepConfigInterface, StepConfigItemTexts, StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from '../types/SoknadFormData';
import {
    arbeidssituasjonStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmPleietrengendeStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { erAnsattISøknadsperiode, harFraværFraArbeidsforholdIPeriode, harFraværIArbeidsforhold } from './ansattUtils';
import { erFrilanserISøknadsperiode } from './frilanserUtils';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        stepIndicatorLabel: intlHelper(intl, conf.stepIndicatorLabel),
        nextButtonLabel: conf.nextButtonLabel ? intlHelper(intl, conf.nextButtonLabel) : undefined,
        nextButtonAriaLabel: conf.nextButtonAriaLabel ? intlHelper(intl, conf.nextButtonAriaLabel) : undefined,
    };
};

export const opplysningerOmPleietrengendeStepAvailable = (formData: SoknadFormData) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: SoknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmPleietrengendeStepIsValid(formData);

export const arbeidssituasjonStepAvailable = (formData: SoknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmPleietrengendeStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const arbeidIPeriodeStepIsAvailable = (formData: SoknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmPleietrengendeStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const medlemskapStepAvailable = (formData: SoknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmPleietrengendeStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid();

export const oppsummeringStepAvailable = (formData: SoknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmPleietrengendeStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    arbeidssituasjonStepIsValid() &&
    medlemskapStepIsValid(formData);

export const skalBrukerSvareArbeidstid = (
    søknadsperiode: DateRange,
    formValues: SoknadFormData
    // søkerdata: Søkerdata | undefined
): boolean => {
    if (!formValues) {
        return false;
    }
    const erAnsattMedFraværIPerioden =
        erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold) &&
        harFraværFraArbeidsforholdIPeriode(formValues.ansatt_arbeidsforhold);

    const erFrilanserMedFraværIPerioden =
        erFrilanserISøknadsperiode(søknadsperiode, formValues.frilans, formValues.frilansoppdrag) &&
        harFraværIArbeidsforhold(formValues.frilans.arbeidsforhold);

    const erSelvstendigMedFraværIPerioden =
        formValues.selvstendig.harHattInntektSomSN === YesOrNo.YES &&
        harFraværIArbeidsforhold(formValues.selvstendig.arbeidsforhold);

    return erAnsattMedFraværIPerioden || erFrilanserMedFraværIPerioden || erSelvstendigMedFraværIPerioden;
};
