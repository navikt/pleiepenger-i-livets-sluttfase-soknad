import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { validateNoCollisions } from '../../components/fravær/fraværValidationUtils';
import { FraværDag, FraværPeriode } from '../../components/fravær';
import dayjs from 'dayjs';

enum FraværErrors {
    ulikeÅrstall = 'ulikeÅrstall',
    perioderEllerDagerOverlapper = 'perioderEllerDagerOverlapper',
}

export const getFraværPerioderValidator =
    ({ fraværDager, årstall }: { fraværDager: FraværDag[]; årstall?: number }) =>
    (fraværPerioder: FraværPeriode[]) => {
        return validateAll<ValidationError>([
            () => getListValidator({ required: true })(fraværPerioder),
            () => (fraværPerioderHarÅrstall(fraværPerioder, årstall) === false ? FraværErrors.ulikeÅrstall : undefined),
            () =>
                validateNoCollisions(fraværDager, fraværPerioder)
                    ? FraværErrors.perioderEllerDagerOverlapper
                    : undefined,
        ]);
    };

export const getFraværDagerValidator =
    ({ fraværPerioder, årstall }: { fraværPerioder: FraværPeriode[]; årstall?: number }) =>
    (fraværDager: FraværDag[]) => {
        return validateAll<ValidationError>([
            () => getListValidator({ required: true })(fraværDager),
            () => (fraværDagerHarÅrstall(fraværDager, årstall) === false ? FraværErrors.ulikeÅrstall : undefined),
            () =>
                validateNoCollisions(fraværDager, fraværPerioder)
                    ? FraværErrors.perioderEllerDagerOverlapper
                    : undefined,
        ]);
    };

const fraværPerioderHarÅrstall = (perioder: FraværPeriode[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return perioder.find((p) => dayjs(p.fraOgMed).year() !== årstall || dayjs(p.tilOgMed).year() !== årstall)
            ? false
            : true;
    }
    return true;
};

const fraværDagerHarÅrstall = (dager: FraværDag[], årstall?: number): boolean => {
    if (årstall !== undefined) {
        return dager.find((d) => dayjs(d.dato).year() !== årstall) ? false : true;
    }
    return true;
};
