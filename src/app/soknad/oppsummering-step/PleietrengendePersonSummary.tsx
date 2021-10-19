import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { PleietrengendePersonApi } from '../../types/SoknadApiData';

interface Props {
    pleietrengendePerson: PleietrengendePersonApi;
}

const PleietrengendePersonSummary = ({ pleietrengendePerson }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.søker.header')}>
            test
            {pleietrengendePerson.fornavn && (
                <SummaryBlock header={pleietrengendePerson.fornavn}>
                    <FormattedMessage id="Fødselsnummer" />:{' '}
                    {pleietrengendePerson.fødselsnummer && (
                        <FødselsnummerSvar fødselsnummer={pleietrengendePerson.fødselsnummer} />
                    )}
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default PleietrengendePersonSummary;
