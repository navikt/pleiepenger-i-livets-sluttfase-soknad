export enum Aktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    STØNAD_FRA_NAV = 'STØNAD_FRA_NAV',
}

export interface AktivitetArbeidstaker {
    orgNummer: string[];
}

export enum ApiAktivitet {
    FRILANSER = 'FRILANSER',
    SELVSTENDIG_NÆRINGSDRIVENDE = 'SELVSTENDIG_NÆRINGSDRIVENDE',
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    STØNAD_FRA_NAV = 'STØNAD_FRA_NAV',
}
export interface Aktiviteter {
    apiAktiviteter: string[];
    orgnummere: string[];
}

export interface AktivitetFravær {
    dato: Date;
    aktivitet: string[];
}
