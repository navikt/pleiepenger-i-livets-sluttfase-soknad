import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import {
    attachmentUploadHasFailed,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import SøknadTempStorage from '../SoknadTempStorage';
import { Person } from '../../types';

interface Props {
    søker: Person;
    soknadId: string;
}

export const cleanupLegeerklæring = (values: SoknadFormData): SoknadFormData => {
    const cleanedValues = { ...values };
    cleanedValues.bekreftelseFraLege = cleanedValues.bekreftelseFraLege.filter(
        (attachment) => !attachmentUploadHasFailed(attachment)
    );
    return cleanedValues;
};

const LegeerklæringStep: React.FC<Props> = ({ søker, soknadId }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[SoknadFormField.bekreftelseFraLege] : [];
    }, [values]);

    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;
    const ref = React.useRef({ attachments });

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            const formValues = { ...values, bekreftelseFraLege: attachments };
            setFieldValue(SoknadFormField.bekreftelseFraLege, attachments);
            SøknadTempStorage.update(soknadId, formValues, StepID.LEGEERKLÆRING, {
                søker,
            });
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, soknadId, søker, values]);

    return (
        <SoknadFormStep
            id={StepID.LEGEERKLÆRING}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}
            onStepCleanup={cleanupLegeerklæring}>
            <>
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <Box padBottom={'l'}>
                        <FormattedMessage id="step.legeerklæring.counsellorPanel.info" />
                    </Box>
                </CounsellorPanel>
                <Box margin="xxl">
                    <Box margin={'l'}>
                        <PictureScanningGuide />
                    </Box>
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'step.opplysninger-om-pleietrengende.vedlegg')}
                        formikName={SoknadFormField.bekreftelseFraLege}
                        dokumenter={values.bekreftelseFraLege}
                        alleDokumenterISøknaden={alleDokumenterISøknaden}
                    />
                </Box>
            </>
        </SoknadFormStep>
    );
};

export default LegeerklæringStep;
