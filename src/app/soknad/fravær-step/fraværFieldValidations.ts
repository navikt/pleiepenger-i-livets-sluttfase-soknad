import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { FraværPeriode } from '@navikt/sif-common-forms/lib';
import { validateNoCollisions } from '@navikt/sif-common-forms/lib/fravær/fraværValidationUtils';

enum FraværErrors {
    ulikeÅrstall = 'ulikeÅrstall',
    perioderEllerDagerOverlapper = 'perioderEllerDagerOverlapper',
    merEnn60dager = 'merEnn60dager',
}

export const getFraværPerioderValidator = () => (fraværPerioder: FraværPeriode[]) => {
    return validateAll<ValidationError>([
        () => getListValidator({ required: true })(fraværPerioder),
        () => (validateNoCollisions([], fraværPerioder) ? FraværErrors.perioderEllerDagerOverlapper : undefined),
    ]);
};
