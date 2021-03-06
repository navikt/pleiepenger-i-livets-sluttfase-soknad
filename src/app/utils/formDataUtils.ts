import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { SoknadFormData } from '../types/SoknadFormData';

export const getSøknadsperiodeFromFormData = ({
    periodeFra,
    periodeTil,
}: Partial<SoknadFormData>): DateRange | undefined => {
    const fraDato = datepickerUtils.getDateFromDateString(periodeFra);
    const tilDato = datepickerUtils.getDateFromDateString(periodeTil);
    if (fraDato && tilDato) {
        return {
            from: fraDato,
            to: tilDato,
        };
    }
    return undefined;
};

export const søkerKunHelgedager = (fom?: string | Date, tom?: string | Date): boolean => {
    if (fom && tom) {
        const fomDayJs = dayjs(fom);
        const tomDayJs = dayjs(tom);

        if ((fomDayJs.isoWeekday() === 6 || fomDayJs.isoWeekday() === 7) && fomDayJs.isSame(tomDayJs, 'day')) {
            return true;
        } else if (fomDayJs.isoWeekday() === 6 && tomDayJs.isSame(fomDayJs.add(1, 'd'), 'day')) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};
