import { ArbeiderIPeriodenSvar, ArbeidstidPeriodeData } from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    dateToISODate,
    getDatesInDateRange,
    getDurationForISOWeekdayNumber,
    ISODateToDate,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const getDagerMedTidFraArbeidstidPeriodeData = (
    normalTimer: number,
    arbeidstidPeriodeData: ArbeidstidPeriodeData
): DateDurationMap => {
    const datoerIPeriode = getDatesInDateRange(
        { from: arbeidstidPeriodeData.fom, to: arbeidstidPeriodeData.tom },
        true
    );
    const dagerMedTid: DateDurationMap = {};
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        if (arbeidstidPeriodeData.arbeiderHvordan === ArbeiderIPeriodenSvar.redusert) {
            const varighet = getDurationForISOWeekdayNumber(
                arbeidstidPeriodeData.tidFasteDager,
                dayjs(ISODateToDate(isoDate)).isoWeekday()
            );
            if (varighet) {
                dagerMedTid[isoDate] = { ...varighet };
            }
        }
    });
    return dagerMedTid;
};
