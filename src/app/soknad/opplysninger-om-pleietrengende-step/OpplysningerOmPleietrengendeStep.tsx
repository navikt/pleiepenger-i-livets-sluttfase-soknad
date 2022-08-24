import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import SoknadFormComponents from '../SoknadFormComponents';
import { SoknadFormData, SoknadFormField, initialValues } from '../../types/SoknadFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getDateValidator,
    getFødselsnummerValidator,
    getRequiredFieldValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { validateNavn } from '../../validation/fieldValidation';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { useFormikContext } from 'formik';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik';
import { dateToday } from '@navikt/sif-common-utils/lib';
import { ÅrsakManglerIdentitetsnummer } from '../../types/ÅrsakManglerIdentitetsnummer';
import { Person } from '../../types';
import IdPart from './IdPart';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { valuesToAlleDokumenterISøknaden } from '../../utils/attachmentUtils';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';

interface Props {
    søker: Person;
}

const OpplysningerOmPleietrengendeStep: React.FC<Props> = ({ søker }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const {
        values: { harIkkeFnr },
        setFieldValue,
    } = useFormikContext<SoknadFormData>();

    const alleDokumenterISøknaden: Attachment[] = valuesToAlleDokumenterISøknaden(values);
    const totalSize = getTotalSizeOfAttachments(alleDokumenterISøknaden);
    const hasPendingUploads: boolean =
        (values.pleietrengendeId || []).find((a: any) => a.pending === true) !== undefined;
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep
            id={StepID.OPPLYSNINGER_OM_PLEIETRENGENDE}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.opplysninger-om-pleietrengende.counsellorPanel.info" />
                </p>
            </CounsellorPanel>

            <FormBlock>
                <SoknadFormComponents.Input
                    name={SoknadFormField.pleietrengende__navn}
                    label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.navn')}
                    validate={validateNavn}
                    style={{ maxWidth: '20rem' }}
                />

                <FormBlock>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengende__norskIdentitetsnummer}
                        label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.spm.fnr')}
                        validate={
                            harIkkeFnr
                                ? undefined
                                : getFødselsnummerValidator({
                                      required: true,
                                      disallowedValues: søker.fødselsnummer ? [søker.fødselsnummer] : [],
                                  })
                        }
                        inputMode="numeric"
                        maxLength={11}
                        minLength={11}
                        style={{ maxWidth: '20rem' }}
                        disabled={harIkkeFnr}
                    />
                    <Box margin="m">
                        <SoknadFormComponents.Checkbox
                            label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.fnr.harIkkeFnr')}
                            name={SoknadFormField.harIkkeFnr}
                            afterOnChange={(newValue) => {
                                if (newValue) {
                                    resetFieldValue(
                                        SoknadFormField.pleietrengende__norskIdentitetsnummer,
                                        setFieldValue,
                                        initialValues
                                    );
                                } else {
                                    resetFieldValues(
                                        [
                                            SoknadFormField.pleietrengende__årsakManglerIdentitetsnummer,
                                            SoknadFormField.pleietrengende__norskIdentitetsnummer,
                                            SoknadFormField.pleietrengende__fødselsdato,
                                        ],
                                        setFieldValue,
                                        initialValues
                                    );
                                }
                            }}
                        />
                    </Box>
                </FormBlock>
                {harIkkeFnr && (
                    <>
                        <FormBlock>
                            <SoknadFormComponents.DatePicker
                                name={SoknadFormField.pleietrengende__fødselsdato}
                                label={intlHelper(intl, 'step.opplysninger-om-pleietrengende.fødselsdato')}
                                validate={(value) => {
                                    const dateError = getDateValidator({
                                        required: true,
                                        max: dateToday,
                                    })(value);

                                    return dateError;
                                }}
                                maxDate={dateToday}
                                showYearSelector={true}
                            />
                        </FormBlock>
                        <FormBlock margin="l">
                            <SoknadFormComponents.RadioGroup
                                legend={intlHelper(
                                    intl,
                                    'step.opplysninger-om-pleietrengende.årsakManglerIdentitetsnummer.spm'
                                )}
                                name={SoknadFormField.pleietrengende__årsakManglerIdentitetsnummer}
                                radios={Object.keys(ÅrsakManglerIdentitetsnummer).map((årsak) => ({
                                    label: intlHelper(
                                        intl,
                                        `step.opplysninger-om-pleietrengende.årsakManglerIdentitetsnummer.${årsak}`
                                    ),
                                    value: årsak,
                                }))}
                                validate={getRequiredFieldValidator()}
                                checked={
                                    values.pleietrengende.årsakManglerIdentitetsnummer
                                        ? values.pleietrengende.årsakManglerIdentitetsnummer
                                        : undefined
                                }></SoknadFormComponents.RadioGroup>
                        </FormBlock>
                        <FormBlock margin="m">
                            <FormSection title={intlHelper(intl, 'step.opplysninger-om-pleietrengende.id.tittel')}>
                                <Box padBottom="l">
                                    <FormattedMessage id="step.opplysninger-om-pleietrengende.id.info" />
                                </Box>
                                <IdPart alleDokumenterISøknaden={alleDokumenterISøknaden} />
                            </FormSection>
                        </FormBlock>
                    </>
                )}
            </FormBlock>
        </SoknadFormStep>
    );
};

export default OpplysningerOmPleietrengendeStep;
