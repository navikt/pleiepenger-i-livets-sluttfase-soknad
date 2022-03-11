import { storageParser } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import axios, { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { AAregArbeidsgiverRemoteData } from './getArbeidsgivereRemoteData';
import { StepID } from '../soknad/soknadStepsConfig';
import { ResourceType } from '../types/ResourceType';
import { SoknadApiData } from '../types/SoknadApiData';
import { SoknadFormData } from '../types/SoknadFormData';
import { MELLOMLAGRING_VERSION, SøknadTempStorageData } from '../types/SøknadTempStorageData';
import { axiosJsonConfig, getApiUrlByResourceType, sendMultipartPostRequest } from './utils/apiUtils';

export const getPersistUrl = (stepID?: StepID) =>
    stepID
        ? `${getApiUrlByResourceType(ResourceType.MELLOMLAGRING)}?lastStepID=${encodeURI(stepID)}`
        : getApiUrlByResourceType(ResourceType.MELLOMLAGRING);

export const persist = (formData: Partial<SoknadFormData> | undefined, lastStepID?: StepID) => {
    const url = getPersistUrl(lastStepID);
    if (formData) {
        const body: SøknadTempStorageData = {
            formData,
            metadata: {
                lastStepID,
                version: MELLOMLAGRING_VERSION,
                updatedTimestemp: new Date().toISOString(),
            },
        };
        return axios.put(url, { ...body }, axiosJsonConfig);
    } else {
        return axios.post(url, {}, axiosJsonConfig);
    }
};
export const rehydrate = () =>
    axios.get(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), {
        ...axiosJsonConfig,
        transformResponse: storageParser,
    });
export const purge = () =>
    axios.delete(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), { ...axiosConfig, data: {} });

export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);
export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<AAregArbeidsgiverRemoteData>> => {
    return axios.get(
        `${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}&frilansoppdrag=true`,
        axiosJsonConfig
    );
};

export const sendApplication = (data: SoknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosJsonConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
