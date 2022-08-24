import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

export const valuesToAlleDokumenterISøknaden = (values: SoknadFormData): Attachment[] => [
    ...values[SoknadFormField.pleietrengendeId],
    ...values[SoknadFormField.bekreftelseFraLege],
];
