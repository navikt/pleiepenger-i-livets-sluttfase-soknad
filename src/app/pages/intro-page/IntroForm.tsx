import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData, ValidationError>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values: { erPleietrengendeILivetsSluttfase, pleierDuDenSykeHjemme } }) => {
                const erPleietrengendeILivetsSluttfaseBesvart = erPleietrengendeILivetsSluttfase === YesOrNo.YES;
                const pleierDuDenSykeHjemmeBesvart = pleierDuDenSykeHjemme === YesOrNo.YES;
                const kanFortsette: boolean = erPleietrengendeILivetsSluttfaseBesvart && pleierDuDenSykeHjemmeBesvart;

                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        includeButtons={kanFortsette}
                        formErrorHandler={getIntlFormErrorHandler(intl, 'introForm.validation')}
                        submitButtonLabel={intlHelper(intl, 'introForm.start')}
                        noButtonsContentRenderer={() =>
                            kanFortsette ? undefined : (
                                <UnansweredQuestionsInfo>
                                    <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                </UnansweredQuestionsInfo>
                            )
                        }>
                        <FormQuestion
                            legend={intlHelper(intl, 'introForm.erPleietrengendeILivetsSluttfase.spm')}
                            name={IntroFormField.erPleietrengendeILivetsSluttfase}
                            validate={getYesOrNoValidator()}
                            showStop={erPleietrengendeILivetsSluttfase === YesOrNo.NO}
                            stopMessage={intlHelper(intl, 'introForm.erPleietrengendeILivetsSluttfase.stopMessage')}
                        />
                        {erPleietrengendeILivetsSluttfaseBesvart && (
                            <FormQuestion
                                legend={intlHelper(intl, 'introForm.pleierDuDenSykeHjemme.spm')}
                                name={IntroFormField.pleierDuDenSykeHjemme}
                                validate={getYesOrNoValidator()}
                                showStop={pleierDuDenSykeHjemme === YesOrNo.NO}
                                stopMessage={intlHelper(intl, 'introForm.pleierDuDenSykeHjemme.stopMessage')}
                                description={
                                    <ExpandableInfo
                                        title={intlHelper(intl, 'introForm.pleierDuDenSykeHjemme.info.tittel')}>
                                        <FormattedMessage id={'introForm.pleierDuDenSykeHjemme.info'} />
                                    </ExpandableInfo>
                                }
                            />
                        )}
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
