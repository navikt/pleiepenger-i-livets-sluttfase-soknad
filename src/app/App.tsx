import React from 'react';
import { render } from 'react-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude/lib';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import IntroPage from './pages/intro-page/IntroPage';
import '@navikt/sif-common-core/lib/styles/globalStyles.less';
import appSentryLogger from './utils/appSentryLogger';
import dayjs from 'dayjs';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import { SanityConfig } from '@navikt/appstatus-react/lib/types';
import Soknad from './soknad/Soknad';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Route, Switch } from 'react-router-dom';
import RouteConfig from './config/routeConfig';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import UnavailablePage from './pages/unavailable-page/UnavailablePage';
import Modal from 'nav-frontend-modal';

export const APPLICATION_KEY = 'pleiepenger-i-livets-sluttfase-soknad';
export const SKJEMANAVN = 'Søknad om pleiepenger ved pleie i hjemmet av nærstående i livets sluttfase';

appSentryLogger.init();
const localeFromSessionStorage = getLocaleFromSessionStorage();
dayjs.locale(localeFromSessionStorage);

const getAppStatusSanityConfig = (): SanityConfig | undefined => {
    const projectId = getEnvironmentVariable('APPSTATUS_PROJECT_ID');
    const dataset = getEnvironmentVariable('APPSTATUS_DATASET');
    return !projectId || !dataset ? undefined : { projectId, dataset };
};
const App = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);

    const appStatusSanityConfig = getAppStatusSanityConfig();
    const publicPath = getEnvironmentVariable('PUBLIC_PATH');

    const content = (
        <Switch>
            <Route path="/" component={IntroPage} exact={true} />
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Soknad} />
        </Switch>
    );

    return (
        <AmplitudeProvider applicationKey={APPLICATION_KEY}>
            <ApplicationWrapper
                locale={locale}
                publicPath={publicPath}
                onChangeLocale={(activeLocale: Locale) => {
                    setLocaleInSessionStorage(activeLocale);
                    setLocale(activeLocale);
                }}>
                {appStatusSanityConfig ? (
                    <AppStatusWrapper
                        applicationKey={APPLICATION_KEY}
                        unavailableContentRenderer={() => <UnavailablePage />}
                        sanityConfig={appStatusSanityConfig}
                        contentRenderer={() => content}
                    />
                ) : (
                    content
                )}
            </ApplicationWrapper>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
