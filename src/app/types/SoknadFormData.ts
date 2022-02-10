import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FraværPeriode, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { AktivitetFravær } from './AktivitetFravær';
import { ArbeidsforholdFormData } from './ArbeidsforholdTypes';

export interface Pleietrengende {
    navn: string;
    norskIdentitetsnummer: string;
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',

    // Opplysninger om pleietrengende
    pleietrengende = 'pleietrengende',
    pleietrengende__navn = 'pleietrengende.navn',
    pleietrengende__norskIdentitetsnummer = 'pleietrengende.norskIdentitetsnummer',
    bekreftelseFraLege = 'bekreftelseFraLege',

    // Fravær
    harPerioderMedFravær = 'harPerioderMedFravær',
    fraværPerioder = 'fraværPerioder',
    perioder_harVærtIUtlandet = 'perioder_harVærtIUtlandet',
    perioder_utenlandsopphold = 'perioder_utenlandsopphold',

    // Fravær fra
    aktivitetFravær = 'aktivitetFravær',

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
    [SoknadFormField.bekreftelseFraLege]: Attachment[];

    // Fravær
    [SoknadFormField.harPerioderMedFravær]: YesOrNo;
    [SoknadFormField.fraværPerioder]: FraværPeriode[];
    [SoknadFormField.perioder_harVærtIUtlandet]: YesOrNo;
    [SoknadFormField.perioder_utenlandsopphold]: Utenlandsopphold[];

    // Fravær fra
    [SoknadFormField.aktivitetFravær]: AktivitetFravær[];

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

export type FrilansFormData = Pick<
    SoknadFormData,
    | SoknadFormField.frilans_erFrilanser
    | SoknadFormField.frilans_jobberFortsattSomFrilans
    | SoknadFormField.frilans_startdato
    | SoknadFormField.frilans_sluttdato
>;

export type SelvstendigFormData = Pick<
    SoknadFormData,
    | SoknadFormField.selvstendig_erSelvstendigNæringsdrivende
    | SoknadFormField.selvstendig_virksomhet
    | SoknadFormField.selvstendig_harFlereVirksomheter
>;

export type OpplysningerOmPleietrengendePersonFormData = Pick<SoknadFormData, SoknadFormField.pleietrengende>;
