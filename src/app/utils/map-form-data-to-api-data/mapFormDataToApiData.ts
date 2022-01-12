import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FraværDag, FraværPeriode } from '../../components/fravær';
import { SoknadApiData, UtbetalingsperiodeApi, YesNoSpørsmålOgSvar, YesNoSvar } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { listOfAttachmentsToListOfUrlStrings } from './mapVedleggToApiData';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { delFraværPerioderOppIDager, getAktivitetFromAktivitetFravær, getApiAktivitetForDag } from '../fraværUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { mapFrilansToApiData } from '../formToApiMaps/mapFrilansToApiData';
import { mapVirksomhetToVirksomhetApiData, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Aktiviteter } from '../../types/AktivitetFravær';
import { getValidSpråk } from '../sprakUtils';
import { getMedlemsskapApiData, mapBostedUtlandToApiData } from '../medlemsskapApiData';
import { showFraværFraStep } from '../getAvailableSteps';

export const mapFormDataToApiData = (formData: SoknadFormData, intl: IntlShape): SoknadApiData | undefined => {
    const locale = getValidSpråk(intl.locale);
    const yesOrNoQuestions: YesNoSpørsmålOgSvar[] = [];

    if (formData.frilans_erFrilanser) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.arbeidssituasjon.frilanser.erFrilanser.spm'),
            svar: mapYesOrNoToSvar(formData.frilans_erFrilanser),
        });
    }
    if (formData.selvstendig_erSelvstendigNæringsdrivende) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.arbeidssituasjon.selvstendig.erDuSelvstendigNæringsdrivende.spm'),
            svar: mapYesOrNoToSvar(formData.selvstendig_erSelvstendigNæringsdrivende),
        });
    }

    const frilans = mapFrilansToApiData(
        formData.frilans_erFrilanser,
        formData.frilans_jobberFortsattSomFrilans,
        formData.frilans_startdato,
        formData.frilans_sluttdato
    );

    const harFlereVirksomheter = formData.selvstendig_harFlereVirksomheter
        ? mapYesOrNoToSvar(formData.selvstendig_harFlereVirksomheter)
        : undefined;

    const virksomhet =
        formData.selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES &&
        formData.selvstendig_virksomhet !== undefined
            ? mapVirksomhetToVirksomhetApiData(locale, formData.selvstendig_virksomhet, harFlereVirksomheter)
            : undefined;

    try {
        const apiData: SoknadApiData = {
            språk: locale,
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            pleietrengende: {
                navn: formData.pleietrengende.navn,
                norskIdentitetsnummer: formData.pleietrengende.norskIdentitetsnummer,
            },
            fraværsperioder: getUtbetalingsperioderApiFromFormData(formData),
            frilans,
            selvstendigNæringsdrivende: virksomhet,
            ...getMedlemsskapApiData(formData, locale),
            utenlandsopphold: settInnOpphold(
                formData.perioder_harVærtIUtlandet,
                formData.perioder_utenlandsopphold,
                locale
            ),
            vedleggUrls: listOfAttachmentsToListOfUrlStrings(formData.bekreftelseFraLege),
            _attachments: formData.bekreftelseFraLege,
            _arbeidsforhold: formData.arbeidsforhold,
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};

export const getUtbetalingsperioderApiFromFormData = (formValues: SoknadFormData): UtbetalingsperiodeApi[] => {
    const {
        fraværDager,
        fraværPerioder,
        aktivitetFravær,
        frilans_erFrilanser,
        selvstendig_erSelvstendigNæringsdrivende,
        arbeidsforhold,
    } = formValues;
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const erSN = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const arbeidsforholdMedFravær = arbeidsforhold
        .filter((f) => f.harHattFraværHosArbeidsgiver === YesOrNo.YES)
        .map((f) => f.organisasjonsnummer);

    if (!showFraværFraStep(formValues)) {
        return [
            ...fraværPerioder.map((periode) =>
                mapFraværPeriodeTilUtbetalingsperiodeApi(
                    periode,
                    getAktivitetFromAktivitetFravær(erFrilanser, erSN, arbeidsforholdMedFravær)
                )
            ),
            ...fraværDager.map((dag) =>
                mapFraværDagTilUtbetalingsperiodeApi(
                    dag,
                    getAktivitetFromAktivitetFravær(erFrilanser, erSN, arbeidsforholdMedFravær)
                )
            ),
        ];
    } else {
        return [
            ...delFraværPerioderOppIDager(fraværPerioder).map((periodeDag) =>
                mapFraværPeriodeTilUtbetalingsperiodeApi(
                    periodeDag,
                    getApiAktivitetForDag(periodeDag.fraOgMed, aktivitetFravær)
                )
            ),
            ...fraværDager.map((dag) =>
                mapFraværDagTilUtbetalingsperiodeApi(dag, getApiAktivitetForDag(dag.dato, aktivitetFravær))
            ),
        ];
    }
    //TODO
    /*} else {
        throw new Error('MAP Missing aktivitet');
    }*/
};

export const mapFraværPeriodeTilUtbetalingsperiodeApi = (
    periode: FraværPeriode,
    aktivitetFravær: Aktiviteter
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(periode.fraOgMed),
        tilOgMed: formatDateToApiFormat(periode.tilOgMed),
        antallTimerPlanlagt: null,
        antallTimerBorte: null,
        aktivitetFravær: aktivitetFravær.apiAktiviteter,
        organisasjonsnummer: aktivitetFravær.orgnummere.length > 0 ? aktivitetFravær.orgnummere : null,
    };
};

export const mapFraværDagTilUtbetalingsperiodeApi = (
    fraværDag: FraværDag,
    aktivitetFravær: Aktiviteter
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(fraværDag.dato),
        tilOgMed: formatDateToApiFormat(fraværDag.dato),
        antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerArbeidsdag))),
        antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerFravær))),
        aktivitetFravær: aktivitetFravær.apiAktiviteter,
        organisasjonsnummer: aktivitetFravær.orgnummere.length > 0 ? aktivitetFravær.orgnummere : null,
    };
};

export const mapYesOrNoToSvar = (input: YesOrNo): YesNoSvar => {
    return input === YesOrNo.YES;
};

const settInnOpphold = (
    periodeHarVærtIUtlandet: YesOrNo,
    periodeUtenlandsopphold: Utenlandsopphold[],
    locale: string
) => {
    return periodeHarVærtIUtlandet === YesOrNo.YES
        ? periodeUtenlandsopphold.map((utenlandsopphold: Utenlandsopphold) => {
              return mapBostedUtlandToApiData(utenlandsopphold, locale);
          })
        : [];
};
