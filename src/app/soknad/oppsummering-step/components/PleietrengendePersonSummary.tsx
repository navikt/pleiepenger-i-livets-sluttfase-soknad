import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { PleietrengendeApi } from '../../../types/SoknadApiData';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';

interface Props {
    pleietrengende: PleietrengendeApi;
}

const PleietrengendePersonSummary = ({ pleietrengende }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.pleietrengende.header')}>
            <SummaryBlock header={formatName(pleietrengende.fornavn, pleietrengende.etternavn)}>
                <FormattedMessage id="fødselsnummer" />{' '}
                <FødselsnummerSvar fødselsnummer={pleietrengende.fødselsnummer} />
            </SummaryBlock>
        </SummarySection>
    );
};

export default PleietrengendePersonSummary;
