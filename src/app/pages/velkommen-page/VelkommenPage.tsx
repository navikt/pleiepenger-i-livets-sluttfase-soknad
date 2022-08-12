import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VelkommenPageForm from './VelkommenPageForm';
import { Sidetittel } from 'nav-frontend-typografi';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';
import { useSoknadContext } from '../../soknad/SoknadContext';

const VelkommenPage = () => {
    const intl = useIntl();
    const { startSoknad } = useSoknadContext();
    useLogSidevisning(SIFCommonPageKey.velkommen);

    return (
        <Page
            title={intlHelper(intl, 'welcomingPage.sidetittel')}
            topContentRenderer={() => (
                <FrontPageBanner
                    bannerSize="large"
                    counsellorWithSpeechBubbleProps={{
                        strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                        normalText: intlHelper(intl, 'welcomingPage.banner.tekst'),
                    }}
                />
            )}>
            <Box margin="xxxl" textAlignCenter={true}>
                <Sidetittel>{intlHelper(intl, 'welcomingPage.introtittel')}</Sidetittel>
            </Box>

            <Box margin="xxxl">
                <VelkommenPageForm onStart={startSoknad} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
