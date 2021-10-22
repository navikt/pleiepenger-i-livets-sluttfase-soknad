import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum IntroFormField {
    'erPleietrengendeILivetsSluttfase' = 'erPleietrengendeILivetsSluttfase',
    'pleierDuDenSykeHjemme' = 'pleierDuDenSykeHjemme',
}

export interface IntroFormData {
    [IntroFormField.erPleietrengendeILivetsSluttfase]: YesOrNo;
    [IntroFormField.pleierDuDenSykeHjemme]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erPleietrengendeILivetsSluttfase]: YesOrNo.UNANSWERED,
    [IntroFormField.pleierDuDenSykeHjemme]: YesOrNo.UNANSWERED,
};
