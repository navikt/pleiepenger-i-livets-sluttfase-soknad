import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { FraværDag, FraværPeriode } from '../../components/fravær';
import dayjs from 'dayjs';
import MinMax from 'dayjs/plugin/minMax';
import { SoknadFormData } from '../../types/SoknadFormData';

dayjs.extend(MinMax);

const cleanupFraværStep = (values: SoknadFormData): SoknadFormData => {
    const { harDagerMedDelvisFravær, harPerioderMedFravær } = values;
    const cleanedValues = { ...values };
    if (harDagerMedDelvisFravær === YesOrNo.NO) {
        cleanedValues.fraværDager = [];
    }
    if (harPerioderMedFravær === YesOrNo.NO) {
        cleanedValues.fraværPerioder = [];
    }

    return cleanedValues;
};

const getÅrstallFromFravær = (
    dagerMedDelvisFravær: FraværDag[],
    perioderMedFravær: FraværPeriode[]
): number | undefined => {
    const førsteDag = dagerMedDelvisFravær.length > 0 ? dagerMedDelvisFravær[0].dato : undefined;
    const førsteDagIPeriode = perioderMedFravær.length > 0 ? perioderMedFravær[0].fraOgMed : undefined;
    const dager: Date[] = [...(førsteDag ? [førsteDag] : []), ...(førsteDagIPeriode ? [førsteDagIPeriode] : [])];
    switch (dager.length) {
        case 0:
            return undefined;
        case 1:
            return dayjs(dager[0]).get('year');
        default:
            return dayjs.min(dager.map((d) => dayjs(d))).get('year');
    }
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
