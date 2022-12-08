import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VelkommenPageForm from './VelkommenPageForm';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import { useSoknadContext } from '../SoknadContext';
import { Person } from '../../types';
import VelkommenGuide from './components/VelkommenGuide';
import OmSøknaden from './components/OmSøknaden';

const VelkommenPage = ({ søker }: { søker: Person }) => {
    const intl = useIntl();
    const { startSoknad } = useSoknadContext();
    useLogSidevisning(SIFCommonPageKey.velkommen);

    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <VelkommenGuide navn={søker.fornavn} />

            <OmSøknaden />

            <Box margin="xxxl">
                <VelkommenPageForm onStart={startSoknad} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
