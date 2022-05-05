import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { renderOpptjeningIUtlandetSummary } from './renderOpptjeningIUtlandetSummary';
import { OpptjeningIUtlandetApi } from '../../../types/SoknadApiData';

export interface Props {
    opptjeningUtland?: OpptjeningIUtlandetApi[];
}

const OpptjeningIUtlandetSummaryView: React.FC<Props> = (props) => {
    const { opptjeningUtland } = props;
    const intl = useIntl();

    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.optjeningIUtlandet.listetittel')}>
                <JaNeiSvar harSvartJa={opptjeningUtland !== undefined} />
            </SummaryBlock>
            {opptjeningUtland !== undefined && (
                <Box margin="m">
                    <SummaryList items={opptjeningUtland} itemRenderer={renderOpptjeningIUtlandetSummary} />
                </Box>
            )}
        </>
    );
};

export default OpptjeningIUtlandetSummaryView;
