import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { StepID } from '../soknad/soknadStepsConfig';
import { History } from 'history';
import RouteConfig from '../config/routeConfig';
import routeConfig, { getRouteUrl } from '../config/routeConfig';

export const userIsCurrentlyOnErrorPage = () => {
    return window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
};

/** Hard redirect enforcing page reload */
const relocateTo = (url: string): void => {
    window.location.assign(url);
};

/** Simple route change, no page reload */
export const navigateTo = (route: string, history: History): void => history.push(route);
export const navigateToSoknadStep = (step: StepID, history: History): void => history.push(`${step}`);

export const relocateToLoginPage = (): void => relocateTo(getEnvironmentVariable('LOGIN_URL'));
export const relocateToNavFrontpage = (): void => relocateTo('https://www.nav.no/');
export const relocateToSoknad = (): void => relocateTo(getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX));
export const relocateToDinePleiepenger = (): void => relocateTo(getEnvironmentVariable('INNSYN_URL'));

export const navigateToSoknadFrontpage = (history: History): void =>
    navigateTo(RouteConfig.SØKNAD_ROUTE_PREFIX, history);
export const navigateToErrorPage = (history: History): void => navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
export const navigateToKvitteringPage = (history: History): void => navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
