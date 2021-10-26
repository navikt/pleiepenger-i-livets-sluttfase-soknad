import { dateToISOString } from '@navikt/sif-common-formik/lib';
// import { dateErHelg } from '@navikt/sif-common-forms/lib';
import { flatten, uniqBy } from 'lodash';
import { AktivitetFravær, Aktivitet, ApiAktivitet } from '../types/AktivitetFravær';
import { getDatesWithinDateRange, sortByDate } from './dates';
import dayjs from 'dayjs';
import { dateErHelg, FraværDag, FraværPeriode } from '../components/fravær';

export const getUtbetalingsdatoerFraFravær = (perioder: FraværPeriode[], dager: FraværDag[]): Date[] => {
    const datoerIPeriode = perioder.map((p) => getDatesWithinDateRange({ from: p.fraOgMed, to: p.tilOgMed }));
    const datoer: Date[] = uniqBy([...flatten(datoerIPeriode), ...dager.map((d) => d.dato)], (d) => {
        return dateToISOString(d);
    });
    return datoer.filter((d) => dateErHelg(d) === false).sort(sortByDate);
};

export const harFraværSomFrilanser = (dager: AktivitetFravær[] = []) => {
    return dager.some((ff) => ff.aktivitet === Aktivitet.BEGGE || ff.aktivitet === Aktivitet.FRILANSER);
};

export const harFraværSomSN = (fraværFraDag: AktivitetFravær[] = []) => {
    return fraværFraDag.some(
        (ff) => ff.aktivitet === Aktivitet.BEGGE || ff.aktivitet === Aktivitet.SELVSTENDIG_VIRKSOMHET
    );
};

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
    erSelvstendigNæringsdrivende: boolean
): ApiAktivitet[] => {
    if (erFrilanser && !erSelvstendigNæringsdrivende) {
        return [ApiAktivitet.FRILANSER];
    }
    if (erSelvstendigNæringsdrivende && !erFrilanser) {
        return [ApiAktivitet.SELVSTENDIG_VIRKSOMHET];
    }
    return [
        ...(harFraværSomFrilanser(aktivitetFravær) ? [ApiAktivitet.FRILANSER] : []),
        ...(harFraværSomSN(aktivitetFravær) ? [ApiAktivitet.SELVSTENDIG_VIRKSOMHET] : []),
    ];
};

export const getApiAktivitetFromAktivitet = (aktivitet: Aktivitet): ApiAktivitet[] => {
    switch (aktivitet) {
        case Aktivitet.BEGGE:
            return [ApiAktivitet.SELVSTENDIG_VIRKSOMHET, ApiAktivitet.FRILANSER];
        case Aktivitet.SELVSTENDIG_VIRKSOMHET:
            return [ApiAktivitet.SELVSTENDIG_VIRKSOMHET];
        case Aktivitet.FRILANSER:
            return [ApiAktivitet.FRILANSER];
    }
};

export const getApiAktivitetForDag = (dato: Date, fravær: AktivitetFravær[]): ApiAktivitet[] => {
    const aktivitetFravær = fravær.find((fa) => dayjs(fa.dato).isSame(dato, 'day'));
    if (!aktivitetFravær) {
        throw new Error('Missing aktivitet for date');
    }
    return getApiAktivitetFromAktivitet(aktivitetFravær.aktivitet);
};
