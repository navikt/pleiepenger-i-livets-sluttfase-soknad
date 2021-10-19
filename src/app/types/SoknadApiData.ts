import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface PleietrengendePersonApi {
    etternavn?: string;
    fornavn?: string;
    fødselsnummer?: string;
    adresse?: string;
    postnummer?: string;
    poststed?: string;
}

export interface SoknadApiData {
    språk: Locale;
    pleietrengendePerson: PleietrengendePersonApi;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
