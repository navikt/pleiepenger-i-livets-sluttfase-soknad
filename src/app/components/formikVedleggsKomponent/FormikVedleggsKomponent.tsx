import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { relocateToLoginPage } from '../../utils/navigationUtils';
import FormikFileUploader from '../formik-file-uploader/FormikFileUploader';
import UploadedDocumentsList from '../uploaded-documents-list/UploadedDocumentsList';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import { alleDokumenterISøknadenToFieldValidationResult } from '../../validation/fieldValidation';

interface Props {
    uploadButtonLabel: string;
    formikName: string;
    dokumenter: Attachment[];
    alleDokumenterISøknaden: Attachment[];
    title?: string;
}

const FormikVedleggsKomponent: React.FC<Props> = ({
    formikName,
    dokumenter,
    alleDokumenterISøknaden,
    uploadButtonLabel,
    title = undefined,
}: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);

    return (
        <div>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    {title && <Element>{title}</Element>}
                    <Box margin={title ? 'm' : undefined}>
                        <FormikFileUploader
                            name={formikName}
                            label={uploadButtonLabel}
                            onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                            onFileInputClick={() => {
                                setFilesThatDidntGetUploaded([]);
                            }}
                            onUnauthorizedOrForbiddenUpload={relocateToLoginPage}
                            validate={() => alleDokumenterISøknadenToFieldValidationResult(alleDokumenterISøknaden)}
                            listOfAttachments={dokumenter}
                        />
                    </Box>
                </FormBlock>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'formikVedleggsKomponent.advarsel.totalstørrelse.1'} />
                        <Lenke
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            href={
                                'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-35.01/ettersendelse'
                            }>
                            <FormattedMessage id={'formikVedleggsKomponent.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="m">
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <Box margin="l">
                <UploadedDocumentsList
                    attachments={dokumenter}
                    formikFieldName={formikName}
                    wrapNoAttachmentsInBox={true}
                    includeDeletionFunctionality={true}
                />
            </Box>
        </div>
    );
};

export default FormikVedleggsKomponent;
