import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum IntroFormField {
    'erSokerlestInformasjonen' = 'erSokerlestInformasjonen',
    'erSokerAleneOmsorg' = 'erSokerAleneOmsorg',
}

export interface IntroFormData {
    [IntroFormField.erSokerlestInformasjonen]: YesOrNo;
    [IntroFormField.erSokerAleneOmsorg]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erSokerlestInformasjonen]: YesOrNo.UNANSWERED,
    [IntroFormField.erSokerAleneOmsorg]: YesOrNo.UNANSWERED,
};
