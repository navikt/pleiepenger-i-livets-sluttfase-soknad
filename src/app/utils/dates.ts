import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

export const date3MonthsAgo = dayjs().subtract(3, 'months').toDate();
export const dateToday = dayjs().toDate();
export const yesterday = dayjs().endOf('day').subtract(1, 'day').toDate();

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

export const erHelg = (date: Date): boolean => {
    const dateDayjs = dayjs(date);
    if (dateDayjs) return dateDayjs.isoWeekday() === 6 || dateDayjs.isoWeekday() === 7;
    return false;
};
