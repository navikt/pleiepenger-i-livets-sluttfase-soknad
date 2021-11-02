export enum Aktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_VIRKSOMHET = 'SELVSTENDIG_VIRKSOMHET',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    ALLE = 'ALLE',
}

export interface AktivitetArbeidstaker {
    orgNummer: string[];
}

export enum ApiAktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_VIRKSOMHET = 'SELVSTENDIG_VIRKSOMHET',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
}
export interface Aktiviteter {
    apiAktiviteter: ApiAktivitet[];
    orgnummere: string[];
}

export interface AktivitetFravær {
    dato: Date;
    aktivitet: string;
}
