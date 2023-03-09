import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
// import { getRedusertArbeidstidSomISODuration } from '@navikt/sif-common-pleiepenger';
import { isYesOrNoAnswered } from '../../validation/fieldValidation';
import { JobberIPeriodeSvar } from '../../types';
import { ArbeidIPeriode } from '../../types/ArbeidIPeriode';
import { Arbeidsforhold, ArbeidsforholdFrilanser } from '../../types/Arbeidsforhold';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../types/SoknadApiData';

import {
    fjernTidUtenforPeriodeOgHelgedager,
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
} from './tidsbrukApiUtils';

export const mapArbeidIPeriodeToApiData = (
    arbeid: ArbeidIPeriode,
    periode: DateRange,
    jobberNormaltTimerNumber: number,
    /** Periode hvor en er aktiv og som kan påvirke dager innenfor perioden, f.eks. noen som starter/slutter i periode */
    arbeidsperiode: Partial<DateRange> | undefined
): ArbeidIPeriodeApiData => {
    const apiData: ArbeidIPeriodeApiData = {
        jobberIPerioden: arbeid.jobberIPerioden,
    };
    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.redusert) {
        return apiData;
    }

    const erLiktHverUke = isYesOrNoAnswered(arbeid.erLiktHverUke) ? arbeid.erLiktHverUke === YesOrNo.YES : undefined;
    const enkeltdager =
        arbeid.enkeltdager && !erLiktHverUke ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode) : undefined;

    return {
        ...apiData,
        erLiktHverUke,
        enkeltdager: arbeidsperiode ? fjernTidUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager) : enkeltdager,
        fasteDager: arbeid.fasteDager && erLiktHverUke ? getFasteDagerApiData(arbeid.fasteDager) : undefined,
    };
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser,
    søknadsperiode: DateRange,
    /** Periode hvor en er aktiv, f.eks. noen som starter sluttet i søknadsperioden */
    arbeidsperiode?: Partial<DateRange>
): ArbeidsforholdApiData => {
    const { jobberNormaltTimer, arbeidIPeriode } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        throw new Error('mapArbeidsforholdToApiData: jobberNormaltTimerNumber === undefined');
    }
    return {
        jobberNormaltTimer: jobberNormaltTimerNumber,
        arbeidIPeriode:
            arbeidIPeriode !== undefined
                ? mapArbeidIPeriodeToApiData(arbeidIPeriode, søknadsperiode, jobberNormaltTimerNumber, arbeidsperiode)
                : undefined,
    };
};
