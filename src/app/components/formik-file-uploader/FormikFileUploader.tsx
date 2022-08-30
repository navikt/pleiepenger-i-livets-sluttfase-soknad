import * as React from 'react';
import { FormikFileInput, TypedFormInputValidationProps } from '@navikt/sif-common-formik/lib';
import { ArrayHelpers } from 'formik';
import { Attachment, PersistedFile } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentShouldBeProcessed,
    attachmentShouldBeUploaded,
    attachmentUploadHasFailed,
    getPendingAttachmentFromFile,
    isFileObject,
    mapFileToPersistedFile,
    VALID_EXTENSIONS,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import api from '../../api/api';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { SoknadFormField } from '../../types/SoknadFormData';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ApiEndpoint } from '../../types/ApiEndpoint';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { getAttachmentURLFrontend } from '../../utils/attachmentUtilsAuthToken';

export type FieldArrayReplaceFn = (index: number, value: any) => void;
export type FieldArrayPushFn = (obj: any) => void;
export type FieldArrayRemoveFn = (index: number) => undefined;

interface FormikFileUploader extends TypedFormInputValidationProps<SoknadFormField, ValidationError> {
    name: string;
    label: string;
    onFileInputClick?: () => void;
    onErrorUploadingAttachments: (files: File[]) => void;
    onUnauthorizedOrForbiddenUpload: () => void;
    listOfAttachments: Attachment[];
}

type Props = FormikFileUploader;

const FormikFileUploader: React.FC<Props> = ({
    name,
    onFileInputClick,
    onErrorUploadingAttachments,
    onUnauthorizedOrForbiddenUpload,
    listOfAttachments,
    ...otherProps
}: Props) => {
    const { logUserLoggedOut } = useAmplitudeInstance();

    function setAttachmentPendingToFalse(attachment: Attachment): Attachment {
        attachment.pending = false;
        return attachment;
    }

    function findAttachmentsToProcess(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeProcessed);
    }

    function findAttachmentsToUpload(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeUploaded);
    }

    function updateAttachmentListElement(
        attachments: Attachment[],
        attachment: Attachment,
        replaceFn: FieldArrayReplaceFn
    ) {
        replaceFn(attachments.indexOf(attachment), { ...attachment, file: mapFileToPersistedFile(attachment.file) });
    }

    function addPendingAttachmentToFieldArray(file: File, pushFn: FieldArrayPushFn): Attachment {
        const attachment = getPendingAttachmentFromFile(file);
        pushFn(attachment);
        return attachment;
    }

    function updateFailedAttachments(
        allAttachments: Attachment[],
        failedAttachments: Attachment[],
        replaceFn: FieldArrayReplaceFn
    ) {
        failedAttachments.forEach((attachment) => {
            attachment = setAttachmentPendingToFalse(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        });
        const failedFiles: File[] = failedAttachments
            .map(({ file }) => file)
            .filter((f: File | PersistedFile) => isFileObject(f)) as File[];

        onErrorUploadingAttachments(failedFiles);
    }

    async function uploadAttachment(attachment: Attachment): Promise<void> {
        const { file } = attachment;
        if (isFileObject(file)) {
            try {
                const response = await api.uploadFile(ApiEndpoint.VEDLEGG, file);
                attachment = setAttachmentPendingToFalse(attachment);
                attachment.url = getAttachmentURLFrontend(response.headers.location);
                attachment.uploaded = true;
            } catch (error) {
                if (isForbidden(error) || isUnauthorized(error)) {
                    await logUserLoggedOut('Ved opplasting av dokument');
                    onUnauthorizedOrForbiddenUpload();
                }
                setAttachmentPendingToFalse(attachment);
            }
        }
    }

    async function uploadAttachments(allAttachments: Attachment[], replaceFn: FieldArrayReplaceFn): Promise<void> {
        const attachmentsToProcess = findAttachmentsToProcess(allAttachments);
        const attachmentsToUpload = findAttachmentsToUpload(attachmentsToProcess);
        const attachmentsNotToUpload = attachmentsToProcess.filter((el) => !attachmentsToUpload.includes(el));

        for (const attachment of attachmentsToUpload) {
            await uploadAttachment(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        }

        const failedAttachments = [...attachmentsNotToUpload, ...attachmentsToUpload.filter(attachmentUploadHasFailed)];
        updateFailedAttachments(allAttachments, failedAttachments, replaceFn);
    }

    return (
        <FormikFileInput
            name={name}
            acceptedExtensions={VALID_EXTENSIONS.join(', ')}
            onFilesSelect={async (files: File[], { push, replace }: ArrayHelpers): Promise<void> => {
                const attachments = files.map((file) => addPendingAttachmentToFieldArray(file, push));
                await uploadAttachments([...listOfAttachments, ...attachments], replace);
            }}
            onClick={onFileInputClick}
            {...otherProps}
        />
    );
};

export default FormikFileUploader;
