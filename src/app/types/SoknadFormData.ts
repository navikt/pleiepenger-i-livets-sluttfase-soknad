export interface GjeldendePerson {
    navn: string;
    fødselsnummer: string;
    fødselsdato: Date;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    gjeldendePerson = 'gjeldendePerson',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.gjeldendePerson]: GjeldendePerson;
}
