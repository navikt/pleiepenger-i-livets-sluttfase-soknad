import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { useFormikContext } from 'formik';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import FormikVedleggsKomponent from '../../components/VedleggComponent/FormikVedleggsKomponent';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

interface Props {
    alleDokumenterISøknaden: Attachment[];
}

const IdPart = ({ alleDokumenterISøknaden }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    return (
        <>
            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            <FormikVedleggsKomponent
                uploadButtonLabel={intlHelper(intl, 'step.opplysninger-om-pleietrengende.id.uploadButtonLabel')}
                formikName={SoknadFormField.pleietrengendeId}
                dokumenter={values.pleietrengendeId}
                alleDokumenterISøknaden={alleDokumenterISøknaden}
            />
        </>
    );
};

export default IdPart;
