import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import { isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import Soknad from './Soknad';

const SoknadRemoteDataFetcher = () => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    return (
        <RemoteDataHandler<SoknadEssentials>
            remoteData={soknadEssentials}
            initializing={(): React.ReactNode => <LoadingPage />}
            loading={(): React.ReactNode => <LoadingPage />}
            error={(error): React.ReactNode => (
                <>
                    {isForbidden(error) && <IkkeTilgangPage />}
                    {!isForbidden(error) && (
                        <ErrorPage
                            bannerTitle={intlHelper(intl, 'application.title')}
                            contentRenderer={() => <SoknadErrorMessages.GeneralApplicationError />}
                        />
                    )}
                </>
            )}
            success={([person, soknadTempStorage]) => {
                return <Soknad søker={person} soknadTempStorage={soknadTempStorage} />;
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
