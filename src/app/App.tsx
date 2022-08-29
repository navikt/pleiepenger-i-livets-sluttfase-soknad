import React from 'react';
import { render } from 'react-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude/lib';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import IntroPage from './pages/intro-page/IntroPage';
import appSentryLogger from './utils/appSentryLogger';
import SoknadApplication from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplication';
import SoknadApplicationCommonRoutes from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplicationCommonRoutes';
import { Route } from 'react-router-dom';
import RouteConfig from './config/routeConfig';
import Modal from 'nav-frontend-modal';
import { applicationIntlMessages } from './i18n/applicationMessages';
import './styles/app.less';
import SoknadRemoteDataFetcher from './soknad/SoknadRemoteDataFetcher';

appSentryLogger.init();

export const APPLICATION_KEY = 'pleiepenger-i-livets-sluttfase-soknad';
export const SKJEMANAVN = 'Søknad om pleiepenger i livets sluttfase';

const App: React.FC = () => {
    const publicPath = getEnvironmentVariable('PUBLIC_PATH');

    return (
        <AmplitudeProvider applicationKey={APPLICATION_KEY}>
            <SoknadApplication
                appName={SKJEMANAVN}
                intlMessages={applicationIntlMessages}
                sentryKey={APPLICATION_KEY}
                appStatus={{
                    applicationKey: APPLICATION_KEY,
                    sanityConfig: {
                        projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                        dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
                    },
                }}
                publicPath={publicPath}>
                <SoknadApplicationCommonRoutes
                    contentRoutes={[
                        <Route path="/" key="intro" exact={true} component={IntroPage} />,
                        <Route
                            path={RouteConfig.SØKNAD_ROUTE_PREFIX}
                            key="soknad"
                            component={SoknadRemoteDataFetcher}
                        />,
                    ]}
                />
            </SoknadApplication>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');

Modal.setAppElement('#app');
render(<App />, root);
