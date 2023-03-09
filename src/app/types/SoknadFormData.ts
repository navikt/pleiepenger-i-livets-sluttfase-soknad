import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Ferieuttak, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { UtenlandskNæring } from '@navikt/sif-common-forms/lib/utenlandsk-næring';
import { OpptjeningUtland } from '@navikt/sif-common-forms/lib/opptjening-utland';
import { Arbeidsforhold } from './Arbeidsforhold';
import { ArbeidsforholdFormData } from './ArbeidsforholdTypes';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilansFormData } from './FrilansFormData';
import { SelvstendigFormData } from './SelvstendigFormData';
import { ÅrsakManglerIdentitetsnummer } from './ÅrsakManglerIdentitetsnummer';

export interface Pleietrengende {
    navn: string;
    norskIdentitetsnummer: string | null;
    årsakManglerIdentitetsnummer?: ÅrsakManglerIdentitetsnummer;
    fødselsdato?: string;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Opplysninger om pleietrengende
    pleietrengende = 'pleietrengende',
    harIkkeFnr = 'harIkkeFnr',
    pleietrengende__navn = 'pleietrengende.navn',
    pleietrengende__norskIdentitetsnummer = 'pleietrengende.norskIdentitetsnummer',
    pleietrengende__fødselsdato = 'pleietrengende.fødselsdato',
    pleietrengende__årsakManglerIdentitetsnummer = 'pleietrengende.årsakManglerIdentitetsnummer',
    pleietrengendeId = 'pleietrengendeId',

    //LEGEERKLÆRING
    bekreftelseFraLege = 'bekreftelseFraLege',

    // Tidsrom
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    pleierDuDenSykeHjemme = 'pleierDuDenSykeHjemme',
    skalOppholdeSegIUtlandetIPerioden = 'skalOppholdeSegIUtlandetIPerioden',
    utenlandsoppholdIPerioden = 'utenlandsoppholdIPerioden',
    skalTaUtFerieIPerioden = 'skalTaUtFerieIPerioden',
    ferieuttakIPerioden = 'ferieuttakIPerioden',

    // Arbeidsforhold
    ansatt_arbeidsforhold = 'ansatt_arbeidsforhold',
    frilans = 'frilans',
    selvstendig = 'selvstendig',
    frilansoppdrag = 'frilansoppdrag',
    harVærtEllerErVernepliktig = 'harVærtEllerErVernepliktig',
    harOpptjeningUtland = 'harOpptjeningUtland',
    opptjeningUtland = 'opptjeningUtland',
    harUtenlandskNæring = 'harUtenlandskNæring',
    utenlandskNæring = 'utenlandskNæring',

    // Inntekt
    arbeidsforhold = 'arbeidsforhold',
    frilans_erFrilanser = 'frilans_erFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    frilans_sluttdato = 'frilans_sluttdato',
    selvstendig_erSelvstendigNæringsdrivende = 'selvstendig_erSelvstendigNæringsdrivende',
    selvstendig_harFlereVirksomheter = 'selvstendig_harFlereVirksomheter',
    selvstendig_virksomhet = 'selvstendig_virksomhet',
    harStønadFraNav = 'harStønadFraNav',

    // Medlemskap
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.pleietrengende]: Pleietrengende;
    [SoknadFormField.harIkkeFnr]: boolean;
    [SoknadFormField.pleietrengendeId]: Attachment[];

    //LEGEERKLÆRING
    [SoknadFormField.bekreftelseFraLege]: Attachment[];

    //Tidsrom
    [SoknadFormField.periodeFra]?: string;
    [SoknadFormField.periodeTil]?: string;
    [SoknadFormField.pleierDuDenSykeHjemme]: YesOrNo;
    [SoknadFormField.skalOppholdeSegIUtlandetIPerioden]?: YesOrNo;
    [SoknadFormField.utenlandsoppholdIPerioden]?: Utenlandsopphold[];
    [SoknadFormField.skalTaUtFerieIPerioden]?: YesOrNo;
    [SoknadFormField.ferieuttakIPerioden]?: Ferieuttak[];

    // Arbeidsforhold
    [SoknadFormField.ansatt_arbeidsforhold]: Arbeidsforhold[];
    [SoknadFormField.frilans]: FrilansFormData;
    [SoknadFormField.frilansoppdrag]: Arbeidsgiver[];
    [SoknadFormField.selvstendig]: SelvstendigFormData;
    [SoknadFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [SoknadFormField.harOpptjeningUtland]: YesOrNo;
    [SoknadFormField.opptjeningUtland]: OpptjeningUtland[];
    [SoknadFormField.harUtenlandskNæring]: YesOrNo;
    [SoknadFormField.utenlandskNæring]: UtenlandskNæring[];

    // Inntekt
    [SoknadFormField.arbeidsforhold]: ArbeidsforholdFormData[];
    [SoknadFormField.frilans_erFrilanser]: YesOrNo;
    [SoknadFormField.frilans_startdato]?: string;
    [SoknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SoknadFormField.frilans_sluttdato]?: string;
    [SoknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo;
    [SoknadFormField.selvstendig_harFlereVirksomheter]?: YesOrNo;
    [SoknadFormField.selvstendig_virksomhet]?: Virksomhet;
    [SoknadFormField.harStønadFraNav]: YesOrNo;

    // Medlemskap
    [SoknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SoknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SoknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SoknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
}

export const initialValues: SoknadFormData = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.pleietrengende]: {
        navn: '',
        norskIdentitetsnummer: '',
        fødselsdato: '',
    },
    [SoknadFormField.harIkkeFnr]: false,
    [SoknadFormField.pleietrengendeId]: [],

    //LEGEERKLÆRING
    [SoknadFormField.bekreftelseFraLege]: [],

    //Tidsrom
    [SoknadFormField.periodeFra]: undefined,
    [SoknadFormField.periodeTil]: undefined,
    [SoknadFormField.pleierDuDenSykeHjemme]: YesOrNo.UNANSWERED,
    [SoknadFormField.skalOppholdeSegIUtlandetIPerioden]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandsoppholdIPerioden]: [],
    [SoknadFormField.skalTaUtFerieIPerioden]: YesOrNo.UNANSWERED,
    [SoknadFormField.ferieuttakIPerioden]: [],

    // Arbeidssituasjon
    [SoknadFormField.arbeidsforhold]: [],
    [SoknadFormField.ansatt_arbeidsforhold]: [],
    [SoknadFormField.frilans_erFrilanser]: YesOrNo.UNANSWERED,
    [SoknadFormField.frilans]: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
    [SoknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [SoknadFormField.selvstendig]: {
        harHattInntektSomSN: YesOrNo.UNANSWERED,
    },
    [SoknadFormField.harStønadFraNav]: YesOrNo.UNANSWERED,
    [SoknadFormField.frilansoppdrag]: [],
    [SoknadFormField.harOpptjeningUtland]: YesOrNo.UNANSWERED,
    [SoknadFormField.opptjeningUtland]: [],
    [SoknadFormField.harUtenlandskNæring]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandskNæring]: [],

    // Medlemskap
    [SoknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SoknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandsoppholdNeste12Mnd]: [],
};

export type OpplysningerOmPleietrengendePersonFormData = Pick<SoknadFormData, SoknadFormField.pleietrengende>;
