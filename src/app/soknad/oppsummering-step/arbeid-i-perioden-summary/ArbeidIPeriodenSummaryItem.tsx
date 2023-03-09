import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { TidEnkeltdager, TidFasteDager } from '@navikt/sif-common-pleiepenger';
// import TidEnkeltdager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidEnkeltdager';
// import TidFasteDager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidFasteDager';
// import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib/timer-og-minutter/TimerOgMinutter';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../types/SoknadApiData';

interface Props {
    periode: DateRange;
    arbeidIPeriode: ArbeidIPeriodeApiData;
    normaltimerUke: number;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FC<Props> = ({ arbeidIPeriode }) => {
    const intl = useIntl();

    return (
        <>
            {(arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.heltFravær ||
                arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.somVanlig) && (
                <p style={{ marginTop: 0 }}>
                    <FormattedMessage
                        id={`oppsummering.arbeidIPeriode.jobberIPerioden.${arbeidIPeriode.jobberIPerioden}`}
                    />
                </p>
            )}

            {arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.redusert && (
                <p style={{ marginTop: 0 }}>
                    <FormattedMessage
                        id={`oppsummering.arbeidIPeriode.jobberIPerioden.${arbeidIPeriode.jobberIPerioden}`}
                    />
                </p>
            )}

            {arbeidIPeriode.enkeltdager && (
                <Box margin="m">
                    <TidEnkeltdager dager={arbeidIPeriode.enkeltdager} />
                </Box>
            )}

            {/* Bruker har valgt faste dager eller prosent */}
            {arbeidIPeriode.fasteDager && (
                <>
                    {/* Faste dager */}
                    {arbeidIPeriode.jobberProsent === undefined && (
                        <>
                            <div>{intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke')}:</div>
                            <Box margin="m">
                                <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
