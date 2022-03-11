import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps, StepID } from '../soknadStepsConfig';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import SoknadFormComponents from '../SoknadFormComponents';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getFødselsnummerValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateNavn } from '../../validation/fieldValidation';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { useFormikContext } from 'formik';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import BekreftelseFraLegePart from './BekreftelseFraLegePart';

const OpplysningerOmPleietrengendeStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const søkerdata = React.useContext(SøkerdataContext);
    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[SoknadFormField.bekreftelseFraLege] : [];
    }, [values]);
    const totalSize = getTotalSizeOfAttachments(attachments);
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.OPPLYSNINGER_OM_PLEIETRENGENDE}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.opplysninger-om-pleietrengende.counsellorPanel.info" />
                </p>
            </CounsellorPanel>

            <FormBlock>
                <FormSection title={intlHelper(intl, 'step.opplysninger-om-pleietrengende.title')}>
                    <Box margin="l">
                        <SoknadFormComponents.Input
                            name={SoknadFormField.pleietrengende__navn}
                            label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.navn')}
                            validate={validateNavn}
                            style={{ maxWidth: '20rem' }}
                        />
                    </Box>

                    <Box margin="l">
                        <SoknadFormComponents.Input
                            name={SoknadFormField.pleietrengende__norskIdentitetsnummer}
                            label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.fnr')}
                            validate={getFødselsnummerValidator({
                                required: true,
                                disallowedValues: søkerdata?.søker.fødselsnummer
                                    ? [søkerdata?.søker.fødselsnummer]
                                    : [],
                            })}
                            inputMode="numeric"
                            maxLength={11}
                            minLength={11}
                            style={{ maxWidth: '20rem' }}
                        />
                    </Box>
                </FormSection>
            </FormBlock>
            <FormBlock>
                <FormSection title={intlHelper(intl, 'step.opplysninger-om-pleietrengende.vedlegg.tittel')}>
                    <BekreftelseFraLegePart />
                </FormSection>
            </FormBlock>
        </SoknadFormStep>
    );
};

export default OpplysningerOmPleietrengendeStep;
