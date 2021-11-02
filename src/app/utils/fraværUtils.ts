import { dateToISOString } from '@navikt/sif-common-formik/lib';
// import { dateErHelg } from '@navikt/sif-common-forms/lib';
import { flatten, uniqBy } from 'lodash';
import { AktivitetFravær, ApiAktivitet, Aktiviteter, Aktivitet } from '../types/AktivitetFravær';
import { getDatesWithinDateRange, sortByDate } from './dates';
import dayjs from 'dayjs';
import { dateErHelg, FraværDag, FraværPeriode } from '../components/fravær';
// import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';

export const getUtbetalingsdatoerFraFravær = (perioder: FraværPeriode[], dager: FraværDag[]): Date[] => {
    const datoerIPeriode = perioder.map((p) => getDatesWithinDateRange({ from: p.fraOgMed, to: p.tilOgMed }));
    const datoer: Date[] = uniqBy([...flatten(datoerIPeriode), ...dager.map((d) => d.dato)], (d) => {
        return dateToISOString(d);
    });
    return datoer.filter((d) => dateErHelg(d) === false).sort(sortByDate);
};

/*export const harFraværSomFrilanser = (dager: AktivitetFravær[] = []) => {
    return dager.some((ff) => ff.aktivitet === Aktivitet.FRILANSER);
};

export const harFraværSomSN = (fraværFraDag: AktivitetFravær[] = []) => {
    return fraværFraDag.some((ff) => ff.aktivitet === Aktivitet.SELVSTENDIG_VIRKSOMHET);
};*/

export const delFraværPeriodeOppIDager = (periode: FraværPeriode): FraværPeriode[] => {
    const datoer = getUtbetalingsdatoerFraFravær([periode], []);
    return datoer.map((dato) => ({
        ...periode,
        fraOgMed: dato,
        tilOgMed: dato,
    }));
};

export const delFraværPerioderOppIDager = (perioder: FraværPeriode[]): FraværPeriode[] => {
    return flatten(perioder.map((p) => delFraværPeriodeOppIDager(p)));
};

export const getAktivitetFromAktivitetFravær = (
    aktivitetFravær: AktivitetFravær[],
    erFrilanser: boolean,
    erSelvstendigNæringsdrivende: boolean,
    arbeidsforholdMedFravær: string[]
): Aktiviteter => {
    if (erFrilanser && !erSelvstendigNæringsdrivende && arbeidsforholdMedFravær.length === 0) {
        return { apiAktiviteter: [ApiAktivitet.FRILANSER], orgnummere: [] };
    }
    if (erSelvstendigNæringsdrivende && !erFrilanser) {
        return { apiAktiviteter: [ApiAktivitet.SELVSTENDIG_VIRKSOMHET], orgnummere: [] };
    }

    if (!erSelvstendigNæringsdrivende && !erFrilanser && arbeidsforholdMedFravær.length === 1) {
        return { apiAktiviteter: [ApiAktivitet.ARBEIDSTAKER], orgnummere: arbeidsforholdMedFravær };
    }
    return {
        apiAktiviteter: [
            ...(erFrilanser ? [ApiAktivitet.FRILANSER] : []),
            ...(erSelvstendigNæringsdrivende ? [ApiAktivitet.SELVSTENDIG_VIRKSOMHET] : []),
            ...(arbeidsforholdMedFravær.length > 0 ? [ApiAktivitet.ARBEIDSTAKER] : []),
        ],
        orgnummere: arbeidsforholdMedFravær.length > 0 ? arbeidsforholdMedFravær : [],
    };
};

export const getApiAktivitetFromAktivitet = (
    aktivitet: string,
    arbeidsforholdMedFravær: string[],
    erFrilanser: boolean,
    erSN: boolean
): Aktiviteter => {
    switch (aktivitet) {
        case Aktivitet.ALLE:
            const getApiAktiviteter = () => {
                if (arbeidsforholdMedFravær.length > 0 && erFrilanser && erSN) {
                    return [ApiAktivitet.FRILANSER, ApiAktivitet.SELVSTENDIG_VIRKSOMHET, ApiAktivitet.ARBEIDSTAKER];
                } else if (arbeidsforholdMedFravær.length > 1 && !erFrilanser && !erSN) {
                    return [ApiAktivitet.ARBEIDSTAKER];
                } else if (arbeidsforholdMedFravær.length === 0 && erFrilanser && erSN) {
                    return [ApiAktivitet.FRILANSER, ApiAktivitet.SELVSTENDIG_VIRKSOMHET];
                } else if (arbeidsforholdMedFravær.length > 0 && erFrilanser && !erSN) {
                    return [ApiAktivitet.FRILANSER, ApiAktivitet.ARBEIDSTAKER];
                } else return [ApiAktivitet.SELVSTENDIG_VIRKSOMHET, ApiAktivitet.ARBEIDSTAKER];
            };

            return {
                apiAktiviteter: getApiAktiviteter(),
                orgnummere: arbeidsforholdMedFravær,
            };
        case Aktivitet.SELVSTENDIG_VIRKSOMHET:
            return { apiAktiviteter: [ApiAktivitet.SELVSTENDIG_VIRKSOMHET], orgnummere: [] };
        case Aktivitet.FRILANSER:
            return { apiAktiviteter: [ApiAktivitet.FRILANSER], orgnummere: [] };
        default:
            return { apiAktiviteter: [ApiAktivitet.ARBEIDSTAKER], orgnummere: [aktivitet] };
    }
};

export const getApiAktivitetForDag = (
    dato: Date,
    fravær: AktivitetFravær[],
    arbeidsforholdMedFravær: string[],
    erFrilanser: boolean,
    erSN: boolean
): Aktiviteter => {
    const aktivitetFravær = fravær.find((fa) => dayjs(fa.dato).isSame(dato, 'day'));
    if (!aktivitetFravær) {
        throw new Error('Missing aktivitet for date');
    }
    return getApiAktivitetFromAktivitet(aktivitetFravær.aktivitet, arbeidsforholdMedFravær, erFrilanser, erSN);
};
