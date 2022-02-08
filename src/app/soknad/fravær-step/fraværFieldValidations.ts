import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { FraværPeriode } from '@navikt/sif-common-forms/lib';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import dayjs from 'dayjs';

enum FraværErrors {
    ulikeÅrstall = 'ulikeÅrstall',
    perioderEllerDagerOverlapper = 'perioderEllerDagerOverlapper',
}

export const getFraværPerioderValidator =
    ({ årstall }: { årstall?: number }) =>
    (fraværPerioder: FraværPeriode[]) => {
        return validateAll<ValidationError>([
            () => getListValidator({ required: true })(fraværPerioder),
            () => (fraværPerioderHarÅrstall(fraværPerioder, årstall) === false ? FraværErrors.ulikeÅrstall : undefined),
            () => (validateNoCollisions([], fraværPerioder) ? FraværErrors.perioderEllerDagerOverlapper : undefined),
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
