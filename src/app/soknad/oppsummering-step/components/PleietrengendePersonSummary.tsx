import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { PleietrengendeApi } from '../../../types/SoknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    pleietrengende: PleietrengendeApi;
}

const PleietrengendePersonSummary = ({ pleietrengende }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.pleietrengende.header')}>
            <SummaryBlock header={pleietrengende.navn}>
                {pleietrengende.fødselsdato ? (
                    <Normaltekst>
                        <FormattedMessage
                            id="steg.oppsummering.pleietrengende.fødselsdato"
                            values={{
                                dato: prettifyDate(apiStringDateToDate(pleietrengende.fødselsdato)),
                            }}
                        />
                    </Normaltekst>
                ) : null}
                {pleietrengende.norskIdentitetsnummer && !pleietrengende.årsakManglerIdentitetsnummer && (
                    <>
                        <FormattedMessage id="fødselsnummer" />{' '}
                        <FødselsnummerSvar fødselsnummer={pleietrengende.norskIdentitetsnummer} />
                    </>
                )}
                {pleietrengende.årsakManglerIdentitetsnummer && !pleietrengende.norskIdentitetsnummer && (
                    <Box margin="l">
                        <Normaltekst>
                            <FormattedMessage
                                id="steg.oppsummering.pleietrengende.harIkkeFnr"
                                values={{
                                    årsak: intlHelper(
                                        intl,
                                        `steg.oppsummering.pleietrengende.årsakManglerIdentitetsnummer.${pleietrengende.årsakManglerIdentitetsnummer}`
                                    ),
                                }}
                            />
                        </Normaltekst>
                    </Box>
                )}
            </SummaryBlock>
        </SummarySection>
    );
};

export default PleietrengendePersonSummary;
