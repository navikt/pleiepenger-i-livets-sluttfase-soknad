import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';

const LegeerklæringStep: React.FC = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const hasPendingUploads: boolean =
        (values.bekreftelseFraLege || []).find((a: any) => a.pending === true) !== undefined;
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.LEGEERKLÆRING}
            includeValidationSummary={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
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
