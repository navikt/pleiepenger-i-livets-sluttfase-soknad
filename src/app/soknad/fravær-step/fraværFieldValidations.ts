import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { FraværPeriode } from '@navikt/sif-common-forms/lib';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';
import dayjs from 'dayjs';

enum FraværErrors {
    ulikeÅrstall = 'ulikeÅrstall',
    perioderEllerDagerOverlapper = 'perioderEllerDagerOverlapper',
    merEnn60dager = 'merEnn60dager',
}

export const getFraværPerioderValidator = () => (fraværPerioder: FraværPeriode[]) => {
    return validateAll<ValidationError>([
        () => getListValidator({ required: true })(fraværPerioder),
        () => (validateNoCollisions([], fraværPerioder) ? FraværErrors.perioderEllerDagerOverlapper : undefined),
        // Vet ikke om 60 arbeidsdager eller ikke
        // () => (perioderMerEnn60dager(fraværPerioder) ? FraværErrors.merEnn60dager : undefined),
    ]);
};

export const perioderMerEnn60dager = (fraværPerioder: FraværPeriode[]) => {
    const sum = fraværPerioder.reduce(function (accumulator, currentValue) {
        return accumulator + dayjs(currentValue.tilOgMed).diff(currentValue.fraOgMed, 'days');
    }, 0);
    return sum > 60;
};
