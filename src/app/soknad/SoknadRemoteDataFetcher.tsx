import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import Soknad from './Soknad';
import { isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';

const SoknadRemoteDataFetcher = () => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    return (
        <RemoteDataHandler<SoknadEssentials>
            remoteData={soknadEssentials}
            initializing={() => <LoadingPage />}
            loading={() => <LoadingPage />}
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
            success={([person, arbeidsgivere, soknadTempStorage]) => {
                return <Soknad søker={person} arbeidsgivere={arbeidsgivere} soknadTempStorage={soknadTempStorage} />;
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
