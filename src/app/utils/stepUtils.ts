import { DateRange } from '@navikt/sif-common-formik/lib';
import { SoknadFormData } from '../types/SoknadFormData';
import {
    arbeidssituasjonStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmPleietrengendeStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../validation/stepValidations';
import { erAnsattISøknadsperiode } from './ansattUtils';
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

export const skalBrukerSvareArbeidstid = (søknadsperiode: DateRange, formValues: SoknadFormData): boolean => {
    if (!formValues) {
        return false;
    }

    const erAnsatt = erAnsattISøknadsperiode(formValues.ansatt_arbeidsforhold);
    const erFrilanser = erFrilanserISøknadsperiode(søknadsperiode, formValues.frilans, formValues.frilansoppdrag);
    const erSelvstendig = formValues.selvstendig && erSNISøknadsperiode(søknadsperiode, formValues.selvstendig);

    return erAnsatt || erFrilanser || erSelvstendig;
};
