import React, { useCallback, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { useFormikContext } from 'formik';
import { persist } from '../api/api';
import { SKJEMANAVN } from '../App';
import RouteConfig from '../config/routeConfig';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import { Søkerdata } from '../types/Søkerdata';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { getKvitteringInfoFromApiData } from '../utils/kvitteringUtils';
import { navigateTo, navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { StepID } from './soknadStepsConfig';
import TidsromStep from './tidsrom-step/TidsromStep';
import { KvitteringInfo } from '../types/KvitteringInfo';
import OpplysningerOmPleietrengendeStep from './opplysninger-om-pleietrengende-step/OpplysningerOmPleietrengendeStep';

interface PleiepengesøknadContentProps {
    lastStepID?: StepID;
    harMellomlagring: boolean;
}

const SøknadContent = ({ lastStepID, harMellomlagring }: PleiepengesøknadContentProps) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<SoknadFormData>();
    const history = useHistory();
    const { logHendelse, logUserLoggedOut, logSoknadStartet } = useAmplitudeInstance();

    const sendUserToStep = useCallback(
        async (route: string) => {
            await logHendelse(ApplikasjonHendelse.starterMedMellomlagring, { step: route });
            navigateTo(route, history);
        },
        [logHendelse, history]
    );

    const isOnWelcomPage = location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE;
    const nextStepRoute = søknadHasBeenSent ? undefined : lastStepID ? getNextStepRoute(lastStepID, values) : undefined;

    useEffect(() => {
        if (isOnWelcomPage && nextStepRoute !== undefined) {
            sendUserToStep(nextStepRoute);
        }
        if (isOnWelcomPage && nextStepRoute === undefined && harMellomlagring && !søknadHasBeenSent) {
            sendUserToStep(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE);
        }
    }, [isOnWelcomPage, nextStepRoute, harMellomlagring, søknadHasBeenSent, sendUserToStep]);

    const userNotLoggedIn = async () => {
        await logUserLoggedOut('Mellomlagring ved navigasjon');
        relocateToLoginPage();
    };

    const navigateToNextStepFrom = async (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                persist(values, stepId)
                    .then(() => {
                        navigateTo(nextStepRoute, history);
                    })
                    .catch((error) => {
                        if (apiUtils.isUnauthorized(error)) {
                            userNotLoggedIn();
                        } else {
                            return navigateToErrorPage(history);
                        }
                    });
            }
        });
    };

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        persist(undefined, StepID.OPPLYSNINGER_OM_PLEIETRENGENDE);
        setTimeout(() => {
            navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_PLEIETRENGENDE}`, history);
        });
    };

    const søknadsperiode = values ? getSøknadsperiodeFromFormData(values) : undefined;
    const søknadsdato = dateToday;

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => <WelcomingPage onValidSubmit={startSoknad} />}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE)}
                    render={() => (
                        <OpplysningerOmPleietrengendeStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.OPPLYSNINGER_OM_PLEIETRENGENDE)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={() => <TidsromStep onValidSubmit={() => navigateToNextStepFrom(StepID.TIDSROM)} />}
                />
            )}

            {isAvailable(StepID.ARBEIDSSITUASJON, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSSITUASJON)}
                    render={() => (
                        <ArbeidssituasjonStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSSITUASJON)}
                            søknadsdato={søknadsdato}
                            søknadsperiode={søknadsperiode}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSTID, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSTID)}
                    render={() => (
                        <ArbeidstidStep
                            periode={søknadsperiode}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSTID)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => (
                        <MedlemsskapStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)}
                            søknadsdato={søknadsdato}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.OPPSUMMERING, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.OPPSUMMERING)}
                    render={() => (
                        <OppsummeringStep
                            values={values}
                            søknadsdato={søknadsdato}
                            onApplicationSent={(apiData: SoknadApiData, søkerdata: Søkerdata) => {
                                setKvitteringInfo(getKvitteringInfoFromApiData(apiData, søkerdata));
                                setSøknadHasBeenSent(true);
                                resetForm();
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values, søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => <ConfirmationPage kvitteringInfo={kvitteringInfo} />}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default SøknadContent;
