import React from 'react';
import { useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { BostedUtlandApiData } from '../../../types/SoknadApiData';
import { renderUtenlandsoppholdIPeriodenSummary } from './renderUtenlandsoppholdSummary';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

export interface Props {
    utenlandsopphold: BostedUtlandApiData[];
}

const UtenlandsoppholdISøkeperiodeSummaryView: React.FC<Props> = ({ utenlandsopphold }) => {
    const intl = useIntl();
    return utenlandsopphold && utenlandsopphold.length > 0 ? (
        <SummaryBlock header={intlHelper(intl, 'step.oppsummering.utenlandsoppholdIPerioden.listetittel')}>
            <SummaryList items={utenlandsopphold} itemRenderer={renderUtenlandsoppholdIPeriodenSummary} />
        </SummaryBlock>
    ) : null;
};

export default UtenlandsoppholdISøkeperiodeSummaryView;
