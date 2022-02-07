import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import JaNeiSvar from './JaNeiSvar';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

interface Props {
    virksomhet?: VirksomhetApiData;
}

const SelvstendigSummary: React.FunctionComponent<Props> = ({ virksomhet }) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.virksomhet.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.virksomhet.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={virksomhet !== undefined} />
            </SummaryBlock>

            {virksomhet && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.virksomhet.harFlereVirksomheter.header')}>
                        <JaNeiSvar harSvartJa={virksomhet?.harFlereAktiveVirksomheter} />
                    </SummaryBlock>

                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.virksomhet.virksomhetInfo.tittel')}>
                        <VirksomhetSummary virksomhet={virksomhet} />
                    </SummaryBlock>
                </>
            )}
        </SummarySection>
    );
};

export default SelvstendigSummary;
