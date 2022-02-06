import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { useFormikContext } from 'formik';
import AppRoutes from '../config/routeConfig';
import KvitteringPage from '../pages/kvittering-page/KvitteringPage';
import { Person } from '../types/Person';
import { SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { mapFormDataToApiData } from '../utils/map-form-data-to-api-data/mapFormDataToApiData';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './soknadStepsConfig';
import VelkommenPage from './velkommen-page/VelkommenPage';
import OpplysningerOmPleietrengendeStep from './opplysninger-om-pleietrengende-step/OpplysningerOmPleietrengendeStep';
import FraværStep from './fravær-step/FraværStep';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import FraværFraStep from './fravær-fra-step/FraværFraStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';

interface Props {
    soknadId?: string;
    søker: Person;
}

const SoknadRoutes = ({ soknadId, søker }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values, søker);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();
    const renderSoknadStep = (søker: Person, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.OPPLYSNINGER_OM_PLEIETRENGENDE:
                return <OpplysningerOmPleietrengendeStep søker={søker} />;
            case StepID.FRAVÆR:
                return <FraværStep values={values} />;
            case StepID.ARBEIDSSITUASJON:
                return <ArbeidssituasjonStep />;
            case StepID.FRAVÆR_FRA:
                return <FraværFraStep />;
            case StepID.MEDLEMSKAP:
                return <MedlemsskapStep />;
            case StepID.OPPSUMMERING:
                const apiValues = mapFormDataToApiData(values, intl);
                return <OppsummeringStep apiValues={apiValues} søker={søker} />;
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
            <Route path={AppRoutes.SOKNAD} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={AppRoutes.SOKNAD_SENT} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status) && <KvitteringPage />) {
                            return <KvitteringPage />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>
            {soknadId === undefined && <Redirect key="redirectToWelcome" to={AppRoutes.SOKNAD} />}

            {soknadId &&
                availableSteps.map((step) => {
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => renderSoknadStep(søker, step)}
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
