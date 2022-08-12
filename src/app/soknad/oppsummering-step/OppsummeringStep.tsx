import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import { StepID } from '../soknadStepsConfig';
import SøkerSummary from './components/SøkerSummary';
import { getCheckedValidator } from '@navikt/sif-common-formik/lib/validation';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import PleietrengendePersonSummary from './components/PleietrengendePersonSummary';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import MedlemskapSummaryView from './components/MedlemskapSummaryView';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { renderUtenlandsoppholdIPeriodenSummary } from './summaryItemRenderers';
import dayjs from 'dayjs';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Person } from '../../types';
import ArbeidssituasjonSummary from './arbeidssituasjon-summary/ArbeidssituasjonSummary';
import ArbeidIPeriodenSummary from './arbeid-i-perioden-summary/ArbeidIPeriodenSummary';
import './oppsummeringStep.less';
import { useSoknadContext } from '../SoknadContext';
import { isPending } from '@devexperts/remote-data-ts';
import SoknadFormStep from '../SoknadFormStep';
import { useFormikContext } from 'formik';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

interface Props {
    søker: Person;
    attacments: Attachment[];
    apiValues?: SoknadApiData;
}

const OppsummeringStep: React.FC<Props> = ({ søker, attacments, apiValues }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus, sendSoknad } = useSoknadContext();
    const { values } = useFormikContext<SoknadFormData>();

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={isPending(sendSoknadStatus.status)}
            buttonDisabled={isPending(sendSoknadStatus.status)}
            onSendSoknad={apiValues ? () => sendSoknad(apiValues) : undefined}>
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
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.søknadsperiode.header')}>
                                    <FormattedMessage
                                        id="steg.oppsummering.tidsrom.fomtom"
                                        values={{
                                            fom: `${dayjs(apiStringDateToDate(apiValues.fraOgMed)).format(
                                                'D. MMMM YYYY'
                                            )}`,
                                            tom: `${dayjs(apiStringDateToDate(apiValues.tilOgMed)).format(
                                                'D. MMMM YYYY'
                                            )}`,
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
                                                    itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                                                />
                                            </Box>
                                        )}
                                    </>
                                )}
                            </SummarySection>
                            {/* Arbeidssituasjon i søknadsperiode */}
                            <ArbeidssituasjonSummary
                                apiValues={apiValues}
                                søknadsperiode={{
                                    from: apiStringDateToDate(apiValues.fraOgMed),
                                    to: apiStringDateToDate(apiValues.tilOgMed),
                                }}
                                frilansoppdrag={values.frilansoppdrag}
                            />

                            {/* Arbeid i søknadsperiode */}
                            <ArbeidIPeriodenSummary
                                apiValues={apiValues}
                                søknadsperiode={{
                                    from: apiStringDateToDate(apiValues.fraOgMed),
                                    to: apiStringDateToDate(apiValues.tilOgMed),
                                }}
                            />

                            {/* Medlemskap i folketrygden */}
                            <SummarySection header={intlHelper(intl, 'step.oppsummering.medlemskap.header')}>
                                <MedlemskapSummaryView medlemskap={apiValues.medlemskap} />
                            </SummarySection>

                            {/* Vedlegg */}
                            <SummarySection header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                                <Box margin="m">
                                    <AttachmentList attachments={attacments} />
                                    {attacments.length === 0 && (
                                        <FormattedMessage id="step.oppsummering.dokumenter.ingenVedlegg" />
                                    )}
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
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
