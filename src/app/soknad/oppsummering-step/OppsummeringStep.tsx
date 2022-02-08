import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isPending } from '@devexperts/remote-data-ts';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Person } from 'app/types/Person';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { useSoknadContext } from '../SoknadContext';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SøkerSummary from './components/SøkerSummary';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PleietrengendePersonSummary from './components/PleietrengendePersonSummary';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import UtbetalingsperioderSummaryView from './components/UtbetalingsperioderSummaryView';
import UtenlandsoppholdISøkeperiodeSummaryView from './components/UtenlandsoppholdISøkeperiodeSummaryView';
import FrilansSummary from './components/FrilansSummary';
import SelvstendigSummary from './components/SelvstendigSummary';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import ArbeidsforholdSummaryView from './components/ArbeidsforholdSummaryView';
import { mapFormDataToApiData } from '../../utils/map-form-data-to-api-data/mapFormDataToApiData';

type Props = {
    søker: Person;
    values: SoknadFormData;
};

const OppsummeringStep = ({ søker, values }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const apiValues = mapFormDataToApiData(values, intl);
    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
            <Box margin="xxxl">
                <CounsellorPanel kompakt={true} type="normal">
                    <FormattedMessage id="step.oppsummering.info" />
                </CounsellorPanel>
                {apiValues === undefined && <FormattedMessage id="apiVerdierMangler" />}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} apiValues={apiValues} />

                                <PleietrengendePersonSummary pleietrengende={apiValues.pleietrengende} />

                                {/* Omsorgsdager du søker utbetaling for */}
                                <SummarySection header={intlHelper(intl, 'step.oppsummering.utbetalinger.header')}>
                                    <UtbetalingsperioderSummaryView
                                        utbetalingsperioder={apiValues.fraværsperioder}
                                        arbeidsforhold={apiValues._arbeidsforhold}
                                    />
                                    <UtenlandsoppholdISøkeperiodeSummaryView
                                        utenlandsopphold={apiValues.utenlandsopphold}
                                    />
                                </SummarySection>

                                {/* Arbeidstaker */}
                                {apiValues._arbeidsforhold.length > 0 && (
                                    <ArbeidsforholdSummaryView arbeidsforhold={apiValues._arbeidsforhold} />
                                )}

                                {/* Frilansinntekt */}
                                <FrilansSummary frilans={apiValues.frilans} />

                                {/* Næringsinntekt */}
                                <SelvstendigSummary virksomhet={apiValues.selvstendigNæringsdrivende} />

                                {/* Medlemskap i folketrygden */}
                                <SummarySection header={intlHelper(intl, 'step.oppsummering.medlemskap.header')}>
                                    <MedlemskapSummaryView medlemskap={apiValues.medlemskap} />
                                </SummarySection>
                                {/* Vedlegg */}
                                <SummarySection header={intlHelper(intl, 'step.oppsummering.dokumenter.header')}>
                                    <Box margin="s">
                                        <SummaryBlock
                                            header={
                                                apiValues.vedleggUrls.length > 0
                                                    ? intlHelper(intl, 'steg.oppsummering.bekreftelseFraLege.header')
                                                    : ''
                                            }>
                                            {apiValues.vedleggUrls.length === 0 && (
                                                <FormattedMessage id={'step.oppsummering.dokumenter.ingenVedlegg'} />
                                            )}
                                            {apiValues.vedleggUrls.length > 0 && (
                                                <UploadedDocumentsList
                                                    attachments={apiValues._attachments}
                                                    includeDeletionFunctionality={false}
                                                />
                                            )}
                                        </SummaryBlock>
                                    </Box>
                                </SummarySection>
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={getCheckedValidator()}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
