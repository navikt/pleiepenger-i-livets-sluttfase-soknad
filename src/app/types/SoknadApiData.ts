import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { ArbeidsgiverType } from './Arbeidsgiver';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { JobberIPeriodeSvar } from './JobberIPeriodenSvar';
import { ISODate, ISODuration } from '@navikt/sif-common-utils';
import { ÅrsakManglerIdentitetsnummer } from './ÅrsakManglerIdentitetsnummer';
import { OpptjeningAktivitet } from '../components/pre-common/opptjening-utland';
import { UtenlandskNæringstype } from '../components/pre-common/utenlandsk-næring';
export interface PleietrengendeApi {
    navn: string;
    norskIdentitetsnummer: string | null;
    årsakManglerIdentitetsnummer: ÅrsakManglerIdentitetsnummer | null;
    fødselsdato: string | null;
}

export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface TidFasteDagerApiData {
    mandag?: ISODuration;
    tirsdag?: ISODuration;
    onsdag?: ISODuration;
    torsdag?: ISODuration;
    fredag?: ISODuration;
}

export interface ArbeidIPeriodeApiData {
    jobberIPerioden: JobberIPeriodeSvar;
    erLiktHverUke?: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    fasteDager?: TidFasteDagerApiData;
    jobberProsent?: number;
}

export interface ArbeidsforholdApiData {
    jobberNormaltTimer: number;
    harFraværIPeriode: boolean;
    arbeidIPeriode?: ArbeidIPeriodeApiData;
}

export interface ArbeidsgiverApiData {
    type: ArbeidsgiverType;
    navn: string;
    organisasjonsnummer?: string;
    offentligIdent?: string;
    ansattFom?: ApiStringDate;
    ansattTom?: ApiStringDate;
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: boolean;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface FrilansApiData {
    harHattInntektSomFrilanser: boolean;
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: ApiStringDate;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface SelvstendigNæringsdrivendeApiData {
    virksomhet: VirksomhetApiData;
    arbeidsforhold: ArbeidsforholdApiData;
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

export interface PeriodeApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}
export interface UtenlandsoppholdIPeriodenApiData extends PeriodeApiData {
    landkode: string;
    landnavn: string;
}

export interface LandApi {
    landkode: string;
    landnavn: string;
}

export interface OpptjeningIUtlandetApi {
    navn: string;
    opptjeningType: OpptjeningAktivitet;
    land: LandApi;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}

export interface UtenlandskNæringApi {
    næringstype: UtenlandskNæringstype;
    navnPåVirksomheten: string;
    land: LandApi;
    organisasjonsnummer?: string;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate;
}
export interface SoknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    pleietrengende: PleietrengendeApi;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    utenlandsoppholdIPerioden?: {
        skalOppholdeSegIUtlandetIPerioden: boolean;
        opphold: UtenlandsoppholdIPeriodenApiData[];
    };
    arbeidsgivere?: ArbeidsgiverApiData[];
    frilans?: FrilansApiData;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    medlemskap: MedlemskapApiData;
    harBekreftetOpplysninger: boolean;
    vedleggUrls: string[];
    opplastetIdVedleggUrls: string[];
    harVærtEllerErVernepliktig?: boolean;
    opptjeningIUtlandet: OpptjeningIUtlandetApi[];
    utenlandskNæring: UtenlandskNæringApi[];
    /** Alle felter med _ brukes ikke i mottak, kun for å vise i oppsummering */
    _attachments: Attachment[];
    _harHattInntektSomFrilanser: boolean;
    _harHattInntektSomSelvstendigNæringsdrivende: boolean;
}
