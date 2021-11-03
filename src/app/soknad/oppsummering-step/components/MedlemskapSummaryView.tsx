import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import JaNeiSvar from './JaNeiSvar';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { MedlemskapApiData } from '../../../types/SoknadApiData';

export interface Props {
    medlemskap: MedlemskapApiData;
}

const MedlemskapSummaryView: React.FC<Props> = (props) => {
    const { medlemskap } = props;
    const intl = useIntl();

    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utlandetSiste12.header')}>
                <JaNeiSvar harSvartJa={medlemskap.harBoddIUtlandetSiste12Mnd} />
            </SummaryBlock>
            {medlemskap.harBoddIUtlandetSiste12Mnd && (
                <Box margin="m">
                    <SummaryList
                        items={medlemskap.utenlandsoppholdSiste12Mnd}
                        itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                    />
                </Box>
            )}
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utlandetNeste12.header')}>
                <JaNeiSvar harSvartJa={medlemskap.skalBoIUtlandetNeste12Mnd} />
            </SummaryBlock>
            {medlemskap.skalBoIUtlandetNeste12Mnd && (
                <Box margin="m">
                    <SummaryList
                        items={medlemskap.utenlandsoppholdNeste12Mnd}
                        itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                    />
                </Box>
            )}
        </>
    );
};

export default MedlemskapSummaryView;
