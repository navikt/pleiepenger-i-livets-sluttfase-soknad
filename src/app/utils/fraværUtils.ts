import { dateToISOString } from '@navikt/sif-common-formik/lib';
import { flatten, uniqBy } from 'lodash';
import { AktivitetFravær, ApiAktivitet, Aktiviteter, Aktivitet } from '../types/AktivitetFravær';
import { erHelg, getDatesWithinDateRange, sortByDate } from './dates';
import dayjs from 'dayjs';
import { FraværPeriode } from '@navikt/sif-common-forms/lib';

export const getUtbetalingsdatoerFraFravær = (perioder: FraværPeriode[]): Date[] => {
    const datoerIPeriode = perioder.map((p) => getDatesWithinDateRange({ from: p.fraOgMed, to: p.tilOgMed }));
    const datoer: Date[] = uniqBy([...flatten(datoerIPeriode)], (d) => {
        return dateToISOString(d);
    });
    return datoer.filter((d) => erHelg(d) === false).sort(sortByDate);
};

export const delFraværPeriodeOppIDager = (periode: FraværPeriode): FraværPeriode[] => {
    const datoer = getUtbetalingsdatoerFraFravær([periode]);
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
    erFrilanser: boolean,
    erSelvstendigNæringsdrivende: boolean,
    harStønad: boolean,
    arbeidsforholdMedFravær: string[]
): Aktiviteter => {
    if (erFrilanser && !erSelvstendigNæringsdrivende && !harStønad && arbeidsforholdMedFravær.length === 0) {
        return { apiAktiviteter: [ApiAktivitet.FRILANSER], orgnummere: [] };
    }
    if (erSelvstendigNæringsdrivende && !erFrilanser && !harStønad && arbeidsforholdMedFravær.length === 0) {
        return { apiAktiviteter: [ApiAktivitet.SELVSTENDIG_NÆRINGSDRIVENDE], orgnummere: [] };
    }

    if (harStønad && !erSelvstendigNæringsdrivende && !erFrilanser && arbeidsforholdMedFravær.length === 0) {
        return { apiAktiviteter: [ApiAktivitet.STØNAD_FRA_NAV], orgnummere: [] };
    }

    if (arbeidsforholdMedFravær.length === 1 && !erSelvstendigNæringsdrivende && !erFrilanser && !harStønad) {
        return { apiAktiviteter: [ApiAktivitet.ARBEIDSTAKER], orgnummere: arbeidsforholdMedFravær };
    }
    return {
        apiAktiviteter: [],
        orgnummere: [],
    };
};

export const getApiAktivitetFromAktivitet = (aktivitet: string[]): Aktiviteter => {
    const cleanAktivitetFraOrgNummere = (akt: string): boolean => {
        switch (akt) {
            case Aktivitet.FRILANSER: {
                return true;
            }
            case Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE: {
                return true;
            }
            case Aktivitet.STØNAD_FRA_NAV: {
                return true;
            }
        }
        return false;
    };
    const cleanAktivitetFraAktiviteter = (akt: string): boolean => {
        switch (akt) {
            case Aktivitet.FRILANSER: {
                return false;
            }
            case Aktivitet.SELVSTENDIG_NÆRINGSDRIVENDE: {
                return false;
            }
            case Aktivitet.STØNAD_FRA_NAV: {
                return false;
            }
        }
        return true;
    };
    const cleanedAktiviteterFraOrgNummere = aktivitet.filter((a) => cleanAktivitetFraOrgNummere(a));
    const cleanedAktiviteterFraAktiviteter = aktivitet.filter((a) => cleanAktivitetFraAktiviteter(a));
    if (cleanedAktiviteterFraAktiviteter.length > 0) {
        cleanedAktiviteterFraOrgNummere.push(Aktivitet.ARBEIDSTAKER);
    }
    return {
        apiAktiviteter: cleanedAktiviteterFraOrgNummere,
        orgnummere: cleanedAktiviteterFraAktiviteter,
    };
};

export const getApiAktivitetForDag = (dato: Date, fravær: AktivitetFravær[]): Aktiviteter => {
    const aktivitetFravær = fravær.find((fa) => dayjs(fa.dato).isSame(dato, 'day'));
    if (!aktivitetFravær) {
        throw new Error('Missing aktivitet for date');
    }
    return getApiAktivitetFromAktivitet(aktivitetFravær.aktivitet);
};
