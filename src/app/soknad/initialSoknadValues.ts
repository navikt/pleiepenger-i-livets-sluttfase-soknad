import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

export const initialSoknadFormData: Partial<SoknadFormData> = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.bekreftelseFraLege]: [],
    [SoknadFormField.harPerioderMedFravær]: YesOrNo.UNANSWERED,
    [SoknadFormField.fraværPerioder]: [],
    [SoknadFormField.harDagerMedDelvisFravær]: YesOrNo.UNANSWERED,
    [SoknadFormField.fraværDager]: [],
    [SoknadFormField.perioder_harVærtIUtlandet]: YesOrNo.UNANSWERED,
    [SoknadFormField.perioder_utenlandsopphold]: [],
    // Arbeidssituasjon
    [SoknadFormField.frilans_erFrilanser]: YesOrNo.UNANSWERED,
    [SoknadFormField.selvstendig_erSelvstendigNæringsdrivende]: YesOrNo.UNANSWERED,
    [SoknadFormField.selvstendig_harFlereVirksomheter]: YesOrNo.UNANSWERED,
    [SoknadFormField.aktivitetFravær]: [],

    // STEG 7: Medlemskap
    [SoknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SoknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SoknadFormField.utenlandsoppholdNeste12Mnd]: [],
};
