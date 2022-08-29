import { DateRange } from '@navikt/sif-common-formik/lib';
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
import { erSNISøknadsperiode } from './selvstendigUtils';

export const opplysningerOmPleietrengendeStepAvailable = (formData: SoknadFormData) => welcomingPageIsValid(formData);

export const legeerklæringStepAvailable = (formData: SoknadFormData) =>
    opplysningerOmPleietrengendeStepAvailable(formData);

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
        formValues.selvstendig &&
        erSNISøknadsperiode(søknadsperiode, formValues.selvstendig) &&
        harFraværIArbeidsforhold(formValues.selvstendig.arbeidsforhold);

    return erAnsattMedFraværIPerioden || erFrilanserMedFraværIPerioden || erSelvstendigMedFraværIPerioden;
};
