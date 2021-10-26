import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ApiAktivitet } from './AktivitetFravær';

export interface PleietrengendeApi {
    etternavn: string;
    fornavn: string;
    fødselsnummer: string;
}

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: UtenlandsoppholdApiData[];
    utenlandsoppholdSiste12Mnd: UtenlandsoppholdApiData[];
}

export interface UtenlandsoppholdApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
    erEØSLand: boolean;
}

export interface UtbetalingsperiodeApi {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    antallTimerBorte: string | null; // f eks PT5H30M | "null" (type Duration)
    antallTimerPlanlagt: string | null; // f eks PT5H30M | "null" (type Duration)
    aktivitetFravær: ApiAktivitet[];
}

export interface Frilans {
    startdato: string;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: string;
}

export type YesNoSvar = boolean;
export type Spørsmål = string;
export interface YesNoSpørsmålOgSvar {
    spørsmål: Spørsmål;
    svar: YesNoSvar;
}

export interface SoknadApiData {
    språk: Locale;
    pleietrengende: PleietrengendeApi;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    utbetalingsperioder: UtbetalingsperiodeApi[]; // perioder
    opphold: UtenlandsoppholdApiData[]; // hvis ja på har oppholdt seg i utlandet
    bosteder: UtenlandsoppholdApiData[]; // medlemskap-siden
    frilans?: Frilans;
    selvstendigNæringsdrivende?: VirksomhetApiData;
    vedlegg: string[];
    _attachments: Attachment[];
}
