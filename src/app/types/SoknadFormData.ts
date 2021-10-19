export interface PleietrengendePerson {
    etternavn?: string;
    fornavn?: string;
    fødselsnummer?: string;
    adresse?: string;
    postnummer?: string;
    poststed?: string;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    pleietrengendePerson = 'gjeldendePerson',
    pleietrengendePerson__etternavn = 'pleietrengendePerson.etternavn',
    pleietrengendePerson__fornavn = 'pleietrengendePerson.fornavn',
    pleietrengendePerson__fødselsnummer = 'pleietrengendePerson.fødselsnummer',
    pleietrengendePerson__adresse = 'pleietrengendePerson.adresse',
    pleietrengendePerson__postnummer = 'pleietrengendePerson.postnummer',
    pleietrengendePerson__poststed = 'pleietrengendePerson.poststed',
    harIkkeFødselsnummer = 'harIkkeFødselsnummer',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.pleietrengendePerson]: PleietrengendePerson;
    [SoknadFormField.harIkkeFødselsnummer]: boolean;
}

export type OpplysningerOmPleietrengendePersonFormData = Pick<SoknadFormData, SoknadFormField.pleietrengendePerson>;
