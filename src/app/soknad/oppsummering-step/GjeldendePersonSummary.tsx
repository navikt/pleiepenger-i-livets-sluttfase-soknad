import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { GjeldendePersonApi } from '../../types/SoknadApiData';

interface Props {
    gjeldendePerson: GjeldendePersonApi;
}

const GjeldendePersonSummary = ({ gjeldendePerson }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.søker.header')}>
            <SummaryBlock header={gjeldendePerson.navn}>
                <FormattedMessage id="Fødselsnummer" />:{' '}
                <FødselsnummerSvar fødselsnummer={gjeldendePerson.fødselsnummer} />
            </SummaryBlock>
        </SummarySection>
    );
};

export default GjeldendePersonSummary;
