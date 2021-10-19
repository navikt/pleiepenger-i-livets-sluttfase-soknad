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
import { getFødselsnummerValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { useFormikContext } from 'formik';
import { validateNavn } from '../../validation/fieldValidation';
import { Undertittel } from 'nav-frontend-typografi';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

type Props = {
    søker: Person;
};

const OpplysningerOmPleietrengendePersonStep = ({ søker }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    return (
        <SoknadFormStep id={StepID.OPPLYSNINGER_OM_PLEIETRENGENDE_PERSON}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.opplysninger-om-pleietrengende-person.counsellorPanel.info" />
                </p>
            </CounsellorPanel>
            {!values.harIkkeFødselsnummer && (
                <FormBlock>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__fødselsnummer}
                        label={intlHelper(intl, 'step.opplysninger-om-pleietrengende-person.spm.fnr')}
                        validate={getFødselsnummerValidator({
                            required: true,
                            disallowedValues: [søker.fødselsnummer],
                        })}
                        inputMode="numeric"
                        maxLength={11}
                        minLength={11}
                        style={{ maxWidth: '20rem' }}
                    />
                </FormBlock>
            )}
            {values.harIkkeFødselsnummer && (
                <FormBlock>
                    <Undertittel>Skriv inn opplysninger om den pleietrengende: </Undertittel>

                    <ExpandableInfo title={'Hvis du har ikke addresse'}>
                        Hvis du har en adresse du bor på i Norge, bruk den adressen. Hvis du ikke har en adresse i
                        Norge, vennligst fyll inn din vanlige adresse.
                    </ExpandableInfo>

                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__fornavn}
                        label={'Fornavn'}
                        validate={validateNavn}
                        style={{ maxWidth: '20rem' }}
                    />
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__etternavn}
                        label={'etternavn'}
                        validate={validateNavn}
                        style={{ maxWidth: '20rem' }}
                    />
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__adresse}
                        label={'addresse'}
                        validate={getRequiredFieldValidator()}
                        style={{ maxWidth: '20rem' }}
                    />
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__postnummer}
                        label={'postnummer'}
                        validate={getRequiredFieldValidator()}
                        inputMode="numeric"
                        maxLength={4}
                        minLength={4}
                        style={{ maxWidth: '20rem' }}
                    />
                    <SoknadFormComponents.Input
                        name={SoknadFormField.pleietrengendePerson__poststed}
                        label={'Poststed'}
                        validate={getRequiredFieldValidator()}
                        inputMode="numeric"
                        maxLength={50}
                        minLength={5}
                        style={{ maxWidth: '20rem' }}
                    />
                </FormBlock>
            )}

            <Box margin="l">
                <SoknadFormComponents.Checkbox
                    label={intlHelper(intl, 'step.opplysninger-om-pleietrengende-person.spm.harIkkeFnr')}
                    name={SoknadFormField.harIkkeFødselsnummer}
                />
            </Box>
        </SoknadFormStep>
    );
};

export default OpplysningerOmPleietrengendePersonStep;
