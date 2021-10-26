import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import SoknadFormComponents from '../SoknadFormComponents';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { Person } from '../../types/Person';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getFødselsnummerValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateNavn } from '../../validation/fieldValidation';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import FormikVedleggsKomponent from '../../components/formikVedleggsKomponent/FormikVedleggsKomponent';
import { useFormikContext } from 'formik';
import { Ingress } from 'nav-frontend-typografi';

type Props = {
    søker: Person;
};

const OpplysningerOmPleietrengendeStep = ({ søker }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    return (
        <SoknadFormStep id={StepID.OPPLYSNINGER_OM_PLEIETRENGENDE}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.opplysninger-om-pleietrengende.counsellorPanel.info" />
                </p>
            </CounsellorPanel>

            <FormBlock>
                <Box margin="l">
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengende__fornavn}
                        label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.fornavn')}
                        validate={validateNavn}
                        style={{ maxWidth: '20rem' }}
                    />
                </Box>
                <Box margin="l">
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengende__etternavn}
                        label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.etternavn')}
                        validate={validateNavn}
                        style={{ maxWidth: '20rem' }}
                    />
                </Box>
                <Box margin="l">
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengende__fødselsnummer}
                        label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.fnr')}
                        validate={getFødselsnummerValidator({
                            required: true,
                            disallowedValues: [søker.fødselsnummer],
                        })}
                        inputMode="numeric"
                        maxLength={11}
                        minLength={11}
                        style={{ maxWidth: '20rem' }}
                    />
                </Box>
                <Box margin="xxl">
                    <Ingress>{intlHelper(intl, 'step.opplysninger-om-pleietrengende.vedlegg.tittel')}</Ingress>
                    <Box margin={'xl'}>
                        <PictureScanningGuide />
                    </Box>
                    <FormikVedleggsKomponent
                        uploadButtonLabel={intlHelper(intl, 'step.opplysninger-om-pleietrengende.vedlegg')}
                        formikName={SoknadFormField.bekreftelseFraLege}
                        dokumenter={values.bekreftelseFraLege}
                        alleDokumenterISøknaden={values.bekreftelseFraLege}
                    />
                </Box>
            </FormBlock>
        </SoknadFormStep>
    );
};

export default OpplysningerOmPleietrengendeStep;
