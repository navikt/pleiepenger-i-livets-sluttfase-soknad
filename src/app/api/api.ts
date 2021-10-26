import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { isUnauthorized, isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';

export const defaultAxiosConfig = {
    withCredentials: true,
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

export const axiosConfig = {
    withCredentials: true,
};

axios.defaults.baseURL = getEnvironmentVariable('API_URL');
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    return config;
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (isForbidden(error) || isUnauthorized(error)) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export enum ApiEndpoint {
    'soker' = 'soker',
    'mellomlagring' = 'mellomlagring',
    'barn' = 'barn',
    'sendSoknad' = 'soknad',
    'uploadFile' = 'vedlegg',
}

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, paramString?: string, config?: AxiosRequestConfig) => {
        const url = `${endpoint}${paramString ? `?${paramString}` : ''}`;
        return axios.get<ResponseType>(url, config || defaultAxiosConfig);
    },
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType, config?: AxiosRequestConfig) => {
        return axios.post<ResponseType>(endpoint, data, config || defaultAxiosConfig);
    },
    delete: <ResponseType = any>(url: string) => {
        return axios.delete<ResponseType>(url, axiosConfig);
    },
};

export default api;
