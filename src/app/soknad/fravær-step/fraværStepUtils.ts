import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { FraværPeriode } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';
import MinMax from 'dayjs/plugin/minMax';
import { SoknadFormData } from '../../types/SoknadFormData';

dayjs.extend(MinMax);

const cleanupFraværStep = (values: SoknadFormData): SoknadFormData => {
    const { harPerioderMedFravær } = values;
    const cleanedValues = { ...values };

    if (harPerioderMedFravær === YesOrNo.NO) {
        cleanedValues.fraværPerioder = [];
    }

    return cleanedValues;
};

const getÅrstallFromFravær = (perioderMedFravær: FraværPeriode[]): number | undefined => {
    const førsteDagIPeriode = perioderMedFravær.length > 0 ? perioderMedFravær[0].fraOgMed : undefined;
    return førsteDagIPeriode ? dayjs(førsteDagIPeriode).get('year') : undefined;
};

const getTidsromFromÅrstall = (årstall?: number): DateRange => {
    if (årstall === undefined) {
        return { from: date1YearAgo, to: dayjs().endOf('day').toDate() };
    }
    const førsteDagIÅret = dayjs(`${årstall}-01-01`).toDate();
    const sisteDagIÅret = dayjs(`${årstall}-12-31`).toDate();
    return {
        from: førsteDagIÅret,
        to: dayjs.min([dayjs(sisteDagIÅret), dayjs(dateToday)]).toDate(),
    };
};

const fraværStepUtils = {
    getTidsromFromÅrstall,
    getÅrstallFromFravær,
    cleanupFraværStep,
};

export default fraværStepUtils;
