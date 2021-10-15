import React from 'react';
import { useIntl } from 'react-intl';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Kvittering from '@navikt/sif-common-core/lib/components/kvittering/Kvittering';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const KvitteringPage = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.kvittering);
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering
                tittel={intlHelper(intl, 'kvittering.tittel')}
                liste={{
                    tittel: intlHelper(intl, 'kvittering.info.tittel'),
                    punkter: [intlHelper(intl, 'kvittering.info.1')],
                }}></Kvittering>
        </Page>
    );
};

export default KvitteringPage;
