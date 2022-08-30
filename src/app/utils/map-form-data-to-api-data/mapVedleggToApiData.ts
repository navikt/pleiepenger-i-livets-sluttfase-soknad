import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { getAttachmentURLBackend } from '../attachmentUtilsAuthToken';

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export const listOfAttachmentsToListOfUrlStrings = (attachments: Attachment[]): string[] => {
    return attachments
        .map((attachment: Attachment) => {
            const attachmentUrl = getAttachmentURLBackend(attachment.url);
            return attachmentUrl;
        })
        .filter(notEmpty);
};

export const listOfAttachmentsToListOfDocumentName = (attachments: Attachment[]): string[] => {
    return attachments
        .filter((attachment: Attachment) => notEmpty(attachment.url))
        .map((attachment: Attachment) => {
            return attachment.file.name;
        });
};
