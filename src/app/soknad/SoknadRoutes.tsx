import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import RouteConfig from '../config/routeConfig';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { Person } from '../types/Søkerdata';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useIntl } from 'react-intl';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import { getAvailableSteps } from '../utils/routeUtils';
import { SoknadApiData } from '../types/SoknadApiData';
import VelkommenPage from './velkommen-page/VelkommenPage';
import OpplysningerOmPleietrengendeStep from './opplysninger-om-pleietrengende-step/OpplysningerOmPleietrengendeStep';
import TidsromStep from './tidsrom-step/TidsromStep';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import { SoknadFormData } from '../types/SoknadFormData';
import { mapFormDataToApiData } from '../utils/map-form-data-to-api-data/mapFormDataToApiData';
import { KvitteringInfo } from '../types/KvitteringInfo';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { dateToday } from '@navikt/sif-common-utils/lib';
import LegeerklæringStep from './legeerklæring-step/LegeerklæringStep';

interface Props {
    søker: Person;
    kvitteringInfo?: KvitteringInfo;
    soknadId?: string;
}

const SoknadRoutes: React.FC<Props> = ({ søker, kvitteringInfo, soknadId }) => {
    const intl = useIntl();

    const { values } = useFormikContext<SoknadFormData>();
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();

    const søknadsperiode = getSøknadsperiodeFromFormData(values);
    const søknadsdato = dateToday;

    const availableSteps = getAvailableSteps(values, søknadsperiode);

    const renderSoknadStep = (søker: Person, stepID: StepID, soknadId: string): React.ReactNode => {
        switch (stepID) {
            case StepID.OPPLYSNINGER_OM_PLEIETRENGENDE:
                return <OpplysningerOmPleietrengendeStep søker={søker} soknadId={soknadId} />;
            case StepID.LEGEERKLÆRING:
                return <LegeerklæringStep søker={søker} soknadId={soknadId} />;
            case StepID.TIDSROM:
                return <TidsromStep />;
            case StepID.ARBEIDSSITUASJON:
                return <ArbeidssituasjonStep søker={søker} søknadsperiode={søknadsperiode} søknadsdato={søknadsdato} />;
            case StepID.ARBEIDSTID:
                return <ArbeidstidStep søker={søker} periode={søknadsperiode} soknadId={soknadId} />;
            case StepID.MEDLEMSKAP:
                return <MedlemsskapStep søknadsdato={søknadsdato} />;
            case StepID.OPPSUMMERING:
                const apiValues: SoknadApiData | undefined = mapFormDataToApiData(values, intl);
                return (
                    <OppsummeringStep
                        søker={søker}
                        apiValues={apiValues}
                        attachments={values.bekreftelseFraLege}
                        pleietrengendeId={values.pleietrengendeId}
                    />
                );
        }
    };

    const lastAvailableStep = availableSteps.slice(-1)[0];

    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;
    return (
        <Switch>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true}>
                <VelkommenPage søker={søker} />
            </Route>
            <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status)) {
                            return <ConfirmationPage kvitteringInfo={kvitteringInfo} />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>

            {soknadId === undefined && <Redirect key="redirectToWelcome" to={RouteConfig.SØKNAD_ROUTE_PREFIX} />}
            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, step, soknadId)}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => (
                        <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />
                    )}></ErrorPage>
            </Route>
        </Switch>
    );
};

export default SoknadRoutes;
