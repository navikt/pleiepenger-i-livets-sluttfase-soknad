import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesNoSpørsmålOgSvar } from '../../../types/SoknadApiData';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';

export interface Props {
    yesNoSpørsmålOgSvar: YesNoSpørsmålOgSvar[];
}

export const SpørsmålOgSvarSummaryView: React.FunctionComponent<Props> = (props) => {
    const { yesNoSpørsmålOgSvar } = props;
    return (
        <Box margin="l">
            {yesNoSpørsmålOgSvar.map((sporsmål: YesNoSpørsmålOgSvar, index: number) => {
                return (
                    <Box margin="s" key={`spørsmålOgSvarView${index}`}>
                        <SummaryBlock header={sporsmål.spørsmål}>
                            <JaNeiSvar harSvartJa={sporsmål.svar} />
                        </SummaryBlock>
                    </Box>
                );
            })}
        </Box>
    );
};
