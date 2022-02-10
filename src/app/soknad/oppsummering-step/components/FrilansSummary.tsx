import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Frilans } from '../../../types/SoknadApiData';
import DatoSvar from './DatoSvar';
import JaNeiSvar from './JaNeiSvar';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

interface Props {
    frilans?: Frilans;
}

const FrilansSummary: React.FunctionComponent<Props> = ({ frilans }) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.frilanser.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.frilanser.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={frilans !== undefined} />
            </SummaryBlock>

            {frilans && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.frilanser.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.frilanser.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                    </SummaryBlock>
                    {frilans.jobberFortsattSomFrilans === false && frilans.sluttdato && (
                        <SummaryBlock header={intlHelper(intl, 'step.oppsummering.frilanser.nårSluttet.header')}>
                            <DatoSvar apiDato={frilans.sluttdato} />
                        </SummaryBlock>
                    )}
                </>
            )}
        </SummarySection>
    );
};

export default FrilansSummary;
