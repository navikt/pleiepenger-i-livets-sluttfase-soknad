import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import DinePlikterContent from './dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from './personopplysninger/Personopplysninger';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import intlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { SoknadFormField } from '../../types/SoknadFormData';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    onStart: () => void;
}

const VelkommenPageForm = ({ onStart }: Props) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            formErrorHandler={intlFormErrorHandler(intl, 'validation')}>
            <FormBlock>
                <SoknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                    name={SoknadFormField.harForståttRettigheterOgPlikter}
                    validate={getCheckedValidator()}>
                    <FormattedMessage
                        id="welcomingPage.samtykke.harForståttLabel"
                        values={{
                            plikterLink: (
                                <Lenke href="#" onClick={() => setDialogState({ dinePlikterModalOpen: true })}>
                                    {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                </Lenke>
                            ),
                        }}
                    />
                </SoknadFormComponents.ConfirmationCheckbox>
                <Box textAlignCenter={true} margin="xl">
                    <Hovedknapp>{intlHelper(intl, 'welcomingPage.begynnsøknad')}</Hovedknapp>
                    <FormBlock>
                        <Lenke
                            href="#"
                            onClick={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                            <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                        </Lenke>
                    </FormBlock>
                </Box>
            </FormBlock>

            <InfoDialog
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={() => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </SoknadFormComponents.Form>
    );
};

export default VelkommenPageForm;
