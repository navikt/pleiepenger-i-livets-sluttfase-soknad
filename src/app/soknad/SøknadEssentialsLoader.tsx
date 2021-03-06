import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getSøker, rehydrate } from '../api/api';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Søkerdata } from '../types/Søkerdata';
import { initialValues, SoknadFormData, SoknadFormField } from '../types/SoknadFormData';
import { MELLOMLAGRING_VERSION, SøknadTempStorageData } from '../types/SøknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import { navigateToErrorPage, relocateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import { StepID } from './soknadStepsConfig';

export const VERIFY_MELLOMLAGRING_VERSION = true;

interface OwnProps {
    contentLoadedRenderer: (
        formdata: Partial<SoknadFormData>,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    willRedirectToLoginPage: boolean;
    lastStepID?: StepID;
    formdata: Partial<SoknadFormData>;
    søkerdata?: Søkerdata;
    harMellomlagring: boolean;
    harIkkeTilgang: boolean;
}

type Props = OwnProps & RouteComponentProps;

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

class SøknadEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            willRedirectToLoginPage: false,
            lastStepID: undefined,
            formdata: initialValues,
            harMellomlagring: false,
            harIkkeTilgang: false,
        };

        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse] = await Promise.all([rehydrate(), getSøker()]);
            this.handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse);
        } catch (error: any) {
            this.handleSøkerdataFetchError(error);
        }
    }

    getValidMellomlagring = (data?: SøknadTempStorageData): SøknadTempStorageData | undefined => {
        if (VERIFY_MELLOMLAGRING_VERSION) {
            if (
                data?.metadata?.version === MELLOMLAGRING_VERSION &&
                data?.formData?.harForståttRettigheterOgPlikter === true
            ) {
                return data;
            }
            return undefined;
        }
        return data;
    };

    handleSøkerdataFetchSuccess(mellomlagringResponse: AxiosResponse, søkerResponse: AxiosResponse) {
        const mellomlagring = this.getValidMellomlagring(mellomlagringResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [SoknadFormField.bekreftelseFraLege]: getValidAttachments(mellomlagring.formData.bekreftelseFraLege),
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        this.updateSøkerdata(
            formData || { ...initialValues },
            {
                søker: søkerResponse.data,
            },
            mellomlagring?.metadata?.version !== undefined,
            lastStepID,
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    navigateToErrorPage(this.props.history);
                }
            }
        );
    }

    updateSøkerdata(
        formdata: Partial<SoknadFormData>,
        søkerdata: Søkerdata,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        callback?: () => void
    ) {
        this.setState(
            {
                isLoading: false,
                lastStepID: lastStepID || this.state.lastStepID,
                formdata: formdata || this.state.formdata,
                søkerdata: søkerdata || this.state.søkerdata,
                harMellomlagring,
            },
            callback
        );
    }

    stopLoading() {
        this.setState({
            isLoading: false,
        });
    }

    handleSøkerdataFetchError(error: AxiosError) {
        if (apiUtils.isUnauthorized(error)) {
            this.setState({ ...this.state, willRedirectToLoginPage: true });
            relocateToLoginPage();
        } else if (apiUtils.isForbidden(error)) {
            this.setState({ ...this.state, harIkkeTilgang: true });
        } else if (!userIsCurrentlyOnErrorPage()) {
            appSentryLogger.logApiError(error);
            navigateToErrorPage(this.props.history);
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(this.stopLoading, 200);
    }

    render() {
        const { contentLoadedRenderer } = this.props;
        const {
            isLoading,
            harIkkeTilgang,
            willRedirectToLoginPage,
            lastStepID,
            formdata,
            søkerdata,
            harMellomlagring,
        } = this.state;
        if (isLoading || willRedirectToLoginPage) {
            return <LoadingPage />;
        }
        if (harIkkeTilgang) {
            return <IkkeTilgangPage />;
        }
        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(formdata, harMellomlagring, lastStepID, søkerdata)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default withRouter(SøknadEssentialsLoader);
