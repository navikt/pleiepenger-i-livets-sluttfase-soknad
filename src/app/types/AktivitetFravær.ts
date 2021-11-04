export enum Aktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
}

export interface AktivitetArbeidstaker {
    orgNummer: string[];
}

export enum ApiAktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
}
export interface Aktiviteter {
    apiAktiviteter: string[];
    orgnummere: string[];
}

export interface AktivitetFravær {
    dato: Date;
    aktivitet: string[];
}
