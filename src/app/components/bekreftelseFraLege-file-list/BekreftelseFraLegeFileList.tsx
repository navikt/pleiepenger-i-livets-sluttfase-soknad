import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from '@navikt/sif-common-core/lib/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { deleteFile } from '../../api/api';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';

interface BekreftelseFraLegeFileListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = BekreftelseFraLegeFileListProps;

const BekreftelseFraLegeFileList = ({ wrapNoAttachmentsInBox, includeDeletionFunctionality }: Props) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const bekreftelseFraLege: Attachment[] = values[SoknadFormField.bekreftelseFraLege].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(bekreftelseFraLege)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenBekreftelseFraLegeLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={bekreftelseFraLege}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    setFieldValue(
                        SoknadFormField.bekreftelseFraLege,
                        removeElementFromArray(attachment, bekreftelseFraLege)
                    );
                    if (attachment.url) {
                        deleteFile(attachment.url);
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={bekreftelseFraLege} />;
    }
};

export default connect<BekreftelseFraLegeFileListProps, SoknadFormField>(BekreftelseFraLegeFileList);
