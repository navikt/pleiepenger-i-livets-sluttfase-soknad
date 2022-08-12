import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from '@navikt/sif-common-core/lib/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import api from '../../api/api';
import { SoknadFormData } from '../../types/SoknadFormData';

interface Props {
    attachments: Attachment[];
    formikFieldName: string;
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedDocumentsList: React.FC<Props> = ({ attachments, formikFieldName, includeDeletionFunctionality }) => {
    const { setFieldValue } = useFormikContext<SoknadFormData>();

    const dokumenter: Attachment[] = attachments.filter(({ file }: Attachment) => {
        return file && file.name ? fileExtensionIsValid(file.name) : false;
    });

    if (dokumenter && !containsAnyUploadedAttachments(dokumenter)) {
        return null;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={dokumenter}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(formikFieldName, dokumenter);
                    attachment.url &&
                        api.deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(formikFieldName, removeElementFromArray(attachment, dokumenter));
                            },
                            () => {
                                setFieldValue(formikFieldName, removeElementFromArray(attachment, dokumenter));
                            }
                        );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={dokumenter} />;
    }
};

export default UploadedDocumentsList;
