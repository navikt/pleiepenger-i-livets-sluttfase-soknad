import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FraværDag, FraværPeriode } from '../../components/fravær';
import {
    SoknadApiData,
    UtbetalingsperiodeApi,
    UtenlandsoppholdApiData,
    YesNoSpørsmålOgSvar,
    YesNoSvar,
} from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { listOfAttachmentsToListOfUrlStrings } from './mapVedleggToApiData';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { delFraværPerioderOppIDager, getAktivitetFromAktivitetFravær, getApiAktivitetForDag } from '../fraværUtils';
import { ApiAktivitet } from '../../types/AktivitetFravær';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { mapFrilansToApiData } from '../formToApiMaps/mapFrilansToApiData';
import { mapVirksomhetToVirksomhetApiData, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { mapBostedUtlandToApiData } from '../formToApiMaps/mapBostedUtlandToApiData';

export const mapFormDataToApiData = (
    locale = 'nb',
    formData: SoknadFormData,
    intl: IntlShape
): SoknadApiData | undefined => {
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
            ? mapVirksomhetToVirksomhetApiData(intl.locale, formData.selvstendig_virksomhet, harFlereVirksomheter)
            : undefined;

    try {
        const apiData: SoknadApiData = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            pleietrengende: {
                fornavn: formData.pleietrengende.fornavn,
                etternavn: formData.pleietrengende.etternavn,
                fødselsnummer: formData.pleietrengende.fødselsnummer,
            },
            utbetalingsperioder: getUtbetalingsperioderApiFromFormData(formData),
            frilans,
            selvstendigNæringsdrivende: virksomhet,
            bosteder: settInnBosteder(
                formData.harBoddUtenforNorgeSiste12Mnd,
                formData.utenlandsoppholdSiste12Mnd,
                formData.skalBoUtenforNorgeNeste12Mnd,
                formData.utenlandsoppholdNeste12Mnd,
                intl.locale
            ),
            opphold: settInnOpphold(
                formData.perioder_harVærtIUtlandet,
                formData.perioder_utenlandsopphold,
                intl.locale
            ), // periode siden, har du oppholdt
            vedlegg: listOfAttachmentsToListOfUrlStrings(formData.bekreftelseFraLege),
            _attachments: formData.bekreftelseFraLege,
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
    } = formValues;
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const erSN = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;

    const apiAktivitet: ApiAktivitet[] = getAktivitetFromAktivitetFravær(aktivitetFravær, erFrilanser, erSN);
    if (apiAktivitet.length === 1) {
        return [
            ...fraværDager.map((dag) => mapFraværDagTilUtbetalingsperiodeApi(dag, apiAktivitet)),
            ...fraværPerioder.map((periode) => mapFraværPeriodeTilUtbetalingsperiodeApi(periode, apiAktivitet)),
        ];
    } else if (apiAktivitet.length === 2) {
        return [
            ...fraværDager.map((dag) =>
                mapFraværDagTilUtbetalingsperiodeApi(dag, getApiAktivitetForDag(dag.dato, aktivitetFravær))
            ),
            ...delFraværPerioderOppIDager(fraværPerioder).map((periodeDag) =>
                mapFraværPeriodeTilUtbetalingsperiodeApi(
                    periodeDag,
                    getApiAktivitetForDag(periodeDag.fraOgMed, aktivitetFravær)
                )
            ),
        ];
    } else {
        throw new Error('Missing aktivitet');
    }
};

export const mapFraværPeriodeTilUtbetalingsperiodeApi = (
    periode: FraværPeriode,
    aktivitetFravær: ApiAktivitet[]
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(periode.fraOgMed),
        tilOgMed: formatDateToApiFormat(periode.tilOgMed),
        antallTimerPlanlagt: null,
        antallTimerBorte: null,
        aktivitetFravær,
    };
};

export const mapFraværDagTilUtbetalingsperiodeApi = (
    fraværDag: FraværDag,
    aktivitetFravær: ApiAktivitet[]
): UtbetalingsperiodeApi => {
    return {
        fraOgMed: formatDateToApiFormat(fraværDag.dato),
        tilOgMed: formatDateToApiFormat(fraværDag.dato),
        antallTimerPlanlagt: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerArbeidsdag))),
        antallTimerBorte: timeToIso8601Duration(decimalTimeToTime(parseFloat(fraværDag.timerFravær))),
        aktivitetFravær,
    };
};

export const mapYesOrNoToSvar = (input: YesOrNo): YesNoSvar => {
    return input === YesOrNo.YES;
};

const settInnBosteder = (
    harBoddUtenforNorgeSiste12Mnd: YesOrNo,
    utenlandsoppholdSiste12Mnd: Utenlandsopphold[],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo,
    utenlandsoppholdNeste12Mnd: Utenlandsopphold[],
    locale: string
): UtenlandsoppholdApiData[] => {
    const mappedSiste12Mnd =
        harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
            ? utenlandsoppholdSiste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    const mappedNeste12Mnd =
        skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
            ? utenlandsoppholdNeste12Mnd.map((utenlandsopphold: Utenlandsopphold) => {
                  return mapBostedUtlandToApiData(utenlandsopphold, locale);
              })
            : [];

    return [...mappedSiste12Mnd, ...mappedNeste12Mnd];
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
