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
            renderForm={({ values: { erSokerlestInformasjonen, erSokerAleneOmsorg } }) => {
                const lestInformasjonenBesvart = erSokerlestInformasjonen === YesOrNo.YES;
                const AleneOmsorgBesvart = erSokerAleneOmsorg === YesOrNo.YES;
                const kanFortsette: boolean = lestInformasjonenBesvart && AleneOmsorgBesvart;

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
                            legend={intlHelper(intl, `introForm.erSokerlestInformasjonen.spm`)}
                            name={IntroFormField.erSokerlestInformasjonen}
                            validate={getYesOrNoValidator()}
                            showStop={erSokerlestInformasjonen === YesOrNo.NO}
                            stopMessage={intlHelper(intl, 'introForm.erSokerlestInformasjonen.stopMessage')}
                        />
                        {lestInformasjonenBesvart && (
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.erSokerAleneOmsorg.spm`)}
                                name={IntroFormField.erSokerAleneOmsorg}
                                validate={getYesOrNoValidator()}
                                showStop={erSokerAleneOmsorg === YesOrNo.NO}
                                stopMessage={intlHelper(intl, 'introForm.erSokerAleneOmsorg.stopMessage')}
                            />
                        )}
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
