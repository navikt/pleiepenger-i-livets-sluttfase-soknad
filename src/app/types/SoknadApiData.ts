import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdFormData } from './ArbeidsforholdTypes';

export interface PleietrengendeApi {
    navn: string;
    norskIdentitetsnummer: string;
}

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: BostedUtlandApiData[];
    utenlandsoppholdSiste12Mnd: BostedUtlandApiData[];
}

export interface BostedUtlandApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface UtbetalingsperiodeApi {
    fraOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    tilOgMed: ApiStringDate; // @JsonFormat(pattern = "yyyy-MM-dd")
    aktivitetFravær: string[];
    organisasjonsnummer: Array<string> | null;
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
    harForståttRettigheterOgPlikter: boolean;
    pleietrengende: PleietrengendeApi;
    fraværsperioder: UtbetalingsperiodeApi[];
    utenlandsopphold: BostedUtlandApiData[];
    medlemskap: MedlemskapApiData;
    frilans?: Frilans;
    selvstendigNæringsdrivende?: VirksomhetApiData;
    _arbeidsforhold: ArbeidsforholdFormData[];
    vedleggUrls: string[];
    _attachments: Attachment[];
    harBekreftetOpplysninger: boolean;
}
