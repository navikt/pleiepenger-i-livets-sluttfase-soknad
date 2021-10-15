import React from 'react';
import { FormattedMessage } from 'react-intl';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

const OpplysningerOmGjeldendePersonStep = () => {
    return (
        <SoknadFormStep id={StepID.OPPLYSNINGER_OM_GJELDENDE_PERSON}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.om-omsorgen-for-barn.stepIntro.1" />
                </p>
            </CounsellorPanel>

            <Box margin="l">Questions</Box>
        </SoknadFormStep>
    );
};

export default OpplysningerOmGjeldendePersonStep;
