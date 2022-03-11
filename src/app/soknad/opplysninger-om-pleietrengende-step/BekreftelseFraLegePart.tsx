import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { useFormikContext } from 'formik';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    mapFileToPersistedFile,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { relocateToLoginPage } from '../../utils/navigationUtils';
import { StepID } from '../soknadStepsConfig';
import { persist } from '../../api/api';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import { validateBekreftelseFraLege } from '../../validation/fieldValidation';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import getLenker from '../../lenker';
import Lenke from 'nav-frontend-lenker';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import BekreftelseFraLegeFileList from '../../components/bekreftelseFraLege-file-list/BekreftelseFraLegeFileList';

const BekreftelseFraLegePart = () => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const intl = useIntl();
    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[SoknadFormField.bekreftelseFraLege] : [];
    }, [values]);
    // const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const totalSize = getTotalSizeOfAttachments(attachments);
    // const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    const ref = React.useRef({ attachments });

    const { logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const vedleggOpplastingFeilet = async (files?: File[]) => {
        if (files) {
            if (files.length > 0) {
                await logHendelse(
                    ApplikasjonHendelse.vedleggOpplastingFeilet,
                    files.map((f) => {
                        const { size, type } = f;
                        return {
                            type,
                            size,
                        };
                    })
                );
            }
            setFilesThatDidntGetUploaded(files);
        }
    };

    const userNotLoggedIn = async () => {
        await logUserLoggedOut('Opplasting av dokument');
        relocateToLoginPage();
    };

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            const newValues = attachments.map((a) => {
                const persistedFile = mapFileToPersistedFile(a.file);
                return {
                    ...a,
                    file: persistedFile,
                };
            });
            const valuesToPersist = { ...values, legeerklæring: newValues };
            setFieldValue(SoknadFormField.bekreftelseFraLege, newValues);
            persist(valuesToPersist, StepID.OPPLYSNINGER_OM_PLEIETRENGENDE);
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, values]);

    return (
        <>
            <PictureScanningGuide />
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin="l">
                    <FormikFileUploader
                        name={SoknadFormField.bekreftelseFraLege}
                        label={intlHelper(intl, 'steg.lege.vedlegg')}
                        onErrorUploadingAttachments={vedleggOpplastingFeilet}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={validateBekreftelseFraLege}
                        onUnauthorizedOrForbiddenUpload={userNotLoggedIn}
                    />
                </Box>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.1'} />
                        <Lenke target={'_blank'} rel={'noopener noreferrer'} href={getLenker(intl.locale).ettersend}>
                            <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin={'l'}>
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <BekreftelseFraLegeFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </>
    );
};

export default BekreftelseFraLegePart;
