import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SøkerSummary from './components/SøkerSummary';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PleietrengendePersonSummary from './components/PleietrengendePersonSummary';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { mapFormDataToApiData } from '../../utils/map-form-data-to-api-data/mapFormDataToApiData';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { renderUtenlandsoppholdIPeriodenSummary } from './summaryItemRenderers';
import dayjs from 'dayjs';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Søkerdata } from '../../types';
import { useHistory } from 'react-router-dom';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { purge, sendApplication } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { relocateToLoginPage } from '../../utils/navigationUtils';
import { navigateTo } from '../../utils/navigationUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import routeConfig from '../../config/routeConfig';
import { SøkerdataContextConsumer } from '../../context/SøkerdataContext';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import JaNeiSvar from './components/JaNeiSvar';
import ArbeidssituasjonSummary from './arbeidssituasjon-summary/ArbeidssituasjonSummary';
import ArbeidIPeriodenSummary from './arbeid-i-perioden-summary/ArbeidIPeriodenSummary';
import './oppsummeringStep.less';
import BekreftelseFraLegeFileList from '../../components/bekreftelseFraLege-file-list/BekreftelseFraLegeFileList';

interface Props {
    values: SoknadFormData;
    søknadsdato: Date;
    onApplicationSent: (apiValues: SoknadApiData, søkerdata: Søkerdata) => void;
}

const OppsummeringStep = ({ onApplicationSent, values, søknadsdato }: Props) => {
    const intl = useIntl();
    const [sendingInProgress, setSendingInProgress] = useState<boolean>(false);
    const [soknadSent, setSoknadSent] = useState<boolean>(false);
    const history = useHistory();

    //const søknadStepConfig = getSøknadStepConfig(values);

    const { logSoknadSent, logSoknadFailed, logUserLoggedOut } = useAmplitudeInstance();

    const sendSoknad = async (apiValues: SoknadApiData, søkerdata: Søkerdata) => {
        setSendingInProgress(true);
        try {
            await sendApplication(apiValues);
            await logSoknadSent(SKJEMANAVN);
            await purge();
            setSoknadSent(true);
            onApplicationSent(apiValues, søkerdata);
        } catch (error: any) {
            if (isUnauthorized(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed(SKJEMANAVN);
                appSentryLogger.logApiError(error);
                navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    };
    if (soknadSent) {
        // User is redirected to confirmation page
        return null;
    }

    return (
        <SøkerdataContextConsumer>
            {(søkerdata: Søkerdata | undefined) => {
                if (søkerdata === undefined) {
                    return <div>Det oppstod en feil - informasjon om søker mangler</div>;
                }
                const { søker } = søkerdata;

                const apiValues = mapFormDataToApiData(values, intl);
                if (apiValues === undefined) {
                    return <div>Det oppstod en feil - api-data mangler</div>;
                }
                // console.log(apiValues);
                const søknadsperiode: DateRange = {
                    from: apiStringDateToDate(apiValues.fraOgMed),
                    to: apiStringDateToDate(apiValues.tilOgMed),
                };

                // const apiValuesValidationErrors = validateApiValues(apiValues, intl);
                const apiValuesValidationErrors = undefined;

                const mottarAndreYtelserFraNAV =
                    apiValues.andreYtelserFraNAV && apiValues.andreYtelserFraNAV.length > 0;
                return (
                    <SoknadFormStep
                        id={StepID.OPPSUMMERING}
                        onValidFormSubmit={() => {
                            if (apiValuesValidationErrors === undefined) {
                                setTimeout(() => {
                                    // La view oppdatere seg først
                                    sendSoknad(apiValues, søkerdata);
                                });
                            } else {
                                document.getElementsByClassName('validationErrorSummary');
                            }
                        }}
                        useValidationErrorSummary={false}
                        showSubmitButton={apiValuesValidationErrors === undefined}
                        buttonDisabled={sendingInProgress}
                        showButtonSpinner={sendingInProgress}>
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

                                            {/* Perioden du søker pleiepenger for */}
                                            <SummarySection
                                                header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                                <SummaryBlock
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.søknadsperiode.header'
                                                    )}>
                                                    <FormattedMessage
                                                        id="steg.oppsummering.tidsrom.fomtom"
                                                        values={{
                                                            fom: `${dayjs(søknadsperiode.from).format('D. MMMM YYYY')}`,
                                                            tom: `${dayjs(søknadsperiode.to).format('D. MMMM YYYY')}`,
                                                        }}
                                                    />
                                                </SummaryBlock>

                                                {/* Utenlandsopphold i perioden */}
                                                {apiValues.utenlandsoppholdIPerioden && (
                                                    <>
                                                        <SummaryBlock
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                            )}>
                                                            <FormattedMessage
                                                                id={
                                                                    apiValues.utenlandsoppholdIPerioden
                                                                        .skalOppholdeSegIUtlandetIPerioden
                                                                        ? 'Ja'
                                                                        : 'Nei'
                                                                }
                                                            />
                                                        </SummaryBlock>

                                                        {apiValues.utenlandsoppholdIPerioden.opphold.length > 0 && (
                                                            <Box>
                                                                <SummaryList
                                                                    items={apiValues.utenlandsoppholdIPerioden.opphold}
                                                                    itemRenderer={
                                                                        renderUtenlandsoppholdIPeriodenSummary
                                                                    }
                                                                />
                                                            </Box>
                                                        )}
                                                    </>
                                                )}
                                            </SummarySection>
                                            {/* Arbeidssituasjon i søknadsperiode */}
                                            <ArbeidssituasjonSummary
                                                apiValues={apiValues}
                                                søknadsperiode={søknadsperiode}
                                                frilansoppdrag={values.frilansoppdrag}
                                            />

                                            {/* Arbeid i søknadsperiode */}
                                            <ArbeidIPeriodenSummary
                                                apiValues={apiValues}
                                                søknadsperiode={søknadsperiode}
                                                søknadsdato={søknadsdato}
                                            />
                                            {/* Andre ytelser */}
                                            {isFeatureEnabled(Feature.ANDRE_YTELSER) && (
                                                <SummarySection
                                                    header={intlHelper(intl, 'andreYtelser.summary.header')}>
                                                    <SummaryBlock
                                                        header={intlHelper(
                                                            intl,
                                                            'andreYtelser.summary.mottarAndreYtelser.header'
                                                        )}>
                                                        <JaNeiSvar harSvartJa={mottarAndreYtelserFraNAV} />
                                                    </SummaryBlock>
                                                    {mottarAndreYtelserFraNAV && apiValues.andreYtelserFraNAV && (
                                                        <SummaryBlock
                                                            header={intlHelper(
                                                                intl,
                                                                'andreYtelser.summary.ytelser.header'
                                                            )}>
                                                            <SummaryList
                                                                items={apiValues.andreYtelserFraNAV}
                                                                itemRenderer={(ytelse) =>
                                                                    intlHelper(intl, `NAV_YTELSE.${ytelse}`)
                                                                }
                                                            />
                                                        </SummaryBlock>
                                                    )}
                                                </SummarySection>
                                            )}

                                            {/* Medlemskap i folketrygden */}
                                            <SummarySection
                                                header={intlHelper(intl, 'step.oppsummering.medlemskap.header')}>
                                                <MedlemskapSummaryView medlemskap={apiValues.medlemskap} />
                                            </SummarySection>

                                            {/* Vedlegg */}
                                            <SummarySection
                                                header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                                                <Box margin="m">
                                                    <BekreftelseFraLegeFileList includeDeletionFunctionality={false} />
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
            }}
        </SøkerdataContextConsumer>
    );
};

export default OppsummeringStep;
