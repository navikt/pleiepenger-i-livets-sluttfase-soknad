import React from 'react';
import { useIntl } from 'react-intl';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadApiData } from '../../../types/SoknadApiData';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
import ArbeidssituasjonFrilansSummary from './ArbeidssituasjonFrilansSummary';
import ArbeidssituasjonSNSummary from './ArbeidssituasjonSNSummary';
import { Arbeidsgiver } from '../../../types';
import OpptjeningIUtlandetSummaryView from '../components/OpptjeningIUtlandetSummaryView';

interface Props {
    apiValues: SoknadApiData;
    søknadsperiode: DateRange;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, _frilans, selvstendigNæringsdrivende, opptjeningIUtlandet: opptjeningUtland },
    søknadsperiode,
    frilansoppdrag,
}) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} søknadsperiode={søknadsperiode} />

            <ArbeidssituasjonFrilansSummary frilans={frilans || _frilans} frilansoppdrag={frilansoppdrag} />

            <ArbeidssituasjonSNSummary selvstendigNæringsdrivende={selvstendigNæringsdrivende} />

            <OpptjeningIUtlandetSummaryView opptjeningUtland={opptjeningUtland} />
        </SummarySection>
    );
};

export default ArbeidssituasjonSummary;
