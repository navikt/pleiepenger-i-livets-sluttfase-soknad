import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { getAttachmentURLBackend } from '../attachmentUtilsAuthToken';

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export const listOfAttachmentsToListOfUrlStrings = (attachments: Attachment[]): string[] => {
    return attachments
        .filter((attachment) => !attachmentUploadHasFailed(attachment))
        .map((attachment: Attachment) => {
            const attachmentUrl = getAttachmentURLBackend(attachment.url);
            return attachmentUrl;
        })
        .filter(notEmpty);
};
