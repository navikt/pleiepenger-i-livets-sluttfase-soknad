import { DateRange } from '@navikt/sif-common-formik/lib';
import { SoknadFormData } from '../types/SoknadFormData';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

export const date3MonthsAgo = dayjs().subtract(3, 'months').toDate();

export const sortByDate = (d1: Date, d2: Date): number => (dayjs(d1).isAfter(d2, 'day') ? 1 : -1);

export const getDatesWithinDateRange = ({ from, to }: DateRange): Date[] => {
    const dates: Date[] = [];
    let currentDate: Date = from;
    if (dayjs(from).isAfter(to)) {
        throw new Error('From date cannot be after to date');
    }
    while (dayjs(currentDate).isSameOrBefore(to)) {
        dates.push(currentDate);
        currentDate = dayjs(currentDate).add(1, 'day').toDate();
    }
    return dates;
};

export const getSøknadsperiodeFromFormData = ({
    fraværPerioder,
    fraværDager,
}: Partial<SoknadFormData>): DateRange | undefined => {
    if ((fraværPerioder && fraværPerioder.length > 0) || (fraværDager && fraværDager.length > 0)) {
        const minstFraDatoFraværPerioder =
            fraværPerioder && fraværPerioder?.length > 0
                ? fraværPerioder.reduce((a, b) => (a.fraOgMed < b.fraOgMed ? a : b)).fraOgMed
                : undefined;
        const minstFraværDag =
            fraværDager && fraværDager.length > 0
                ? fraværDager.reduce((a, b) => (a.dato < b.dato ? a : b)).dato
                : undefined;
        const maxTilDatoFraværPerioder =
            fraværPerioder && fraværPerioder.length > 0
                ? fraværPerioder.reduce((a, b) => (a.tilOgMed > b.tilOgMed ? a : b)).tilOgMed
                : undefined;
        const maxFraværDag =
            fraværDager && fraværDager.length > 0
                ? fraværDager.reduce((a, b) => (a.dato > b.dato ? a : b)).dato
                : undefined;

        const søknadsperiode = (): DateRange | undefined => {
            if (minstFraDatoFraværPerioder && minstFraværDag && maxTilDatoFraværPerioder && maxFraværDag) {
                return {
                    from: dayjs(minstFraDatoFraværPerioder).isBefore(minstFraværDag)
                        ? minstFraDatoFraværPerioder
                        : minstFraværDag,
                    to: dayjs(maxTilDatoFraværPerioder).isAfter(maxFraværDag) ? maxTilDatoFraværPerioder : maxFraværDag,
                };
            } else if (minstFraDatoFraværPerioder && maxTilDatoFraværPerioder && !minstFraværDag && !maxFraværDag) {
                return {
                    from: minstFraDatoFraværPerioder,
                    to: maxTilDatoFraværPerioder,
                };
            } else if (!minstFraDatoFraværPerioder && !maxTilDatoFraværPerioder && minstFraværDag && maxFraværDag) {
                return {
                    from: minstFraværDag,
                    to: maxFraværDag,
                };
            } else return undefined;
        };
        return søknadsperiode();
    }

    return undefined;
};
