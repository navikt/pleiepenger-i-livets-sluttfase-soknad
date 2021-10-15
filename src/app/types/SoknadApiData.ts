import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface GjeldendePersonApi {
    navn: string;
    fødselsnummer: string;
    fødselsdato: Date;
}

export interface SoknadApiData {
    språk: Locale;
    gjeldendePerson: GjeldendePersonApi;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
