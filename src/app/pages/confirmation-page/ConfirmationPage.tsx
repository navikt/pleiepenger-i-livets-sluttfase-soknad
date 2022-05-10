import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { KvitteringInfo } from '../../types/KvitteringInfo';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import Kvittering from '@navikt/sif-common-core/lib/components/kvittering/Kvittering';

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const ConfirmationPage = ({ kvitteringInfo }: Props) => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.kvittering);

    const punkter: React.ReactNode[] = kvitteringInfo?.arbeidsgivere
        ? [intlHelper(intl, 'page.confirmation.list.item.1')]
        : [];
    punkter.push(intlHelper(intl, 'page.confirmation.list.item.2'));
    punkter.push(
        <>
            <FormattedMessage id="page.confirmation.list.item.3" />{' '}
            <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                <FormattedMessage id="page.confirmation.list.item.3.lenke" />
            </Lenke>{' '}
            <FormattedMessage id="page.confirmation.list.item.3.1" />
        </>
    );

    return (
        <Page title={intlHelper(intl, 'page.confirmation.sidetittel')}>
            <Kvittering
                tittel={intlHelper(intl, 'page.confirmation.tittel')}
                liste={{
                    tittel: intlHelper(intl, 'page.confirmation.info.tittel'),
                    punkter: punkter,
                }}></Kvittering>
        </Page>
    );
};

export default ConfirmationPage;
