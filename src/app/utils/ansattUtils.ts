import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsforhold } from '../types/Arbeidsforhold';

export const erAnsattHosArbeidsgiverISøknadsperiode = (arbeidsforhold: Arbeidsforhold): boolean => {
    return (
        arbeidsforhold.erAnsatt === YesOrNo.YES ||
        (arbeidsforhold.erAnsatt === YesOrNo.NO && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO)
    );
};

export const erAnsattISøknadsperiode = (arbeidsforhold: Arbeidsforhold[]): boolean => {
    return arbeidsforhold.some(erAnsattHosArbeidsgiverISøknadsperiode);
};
