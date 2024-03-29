import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosJsonConfig, axiosMultipartConfig } from '../config/axiosConfig';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';

const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, axiosMultipartConfig);
};

axios.defaults.baseURL = getEnvironmentVariable('FRONTEND_API_PATH');
axios.defaults.withCredentials = false;
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

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, paramString?: string, config?: AxiosRequestConfig) => {
        const url = `${endpoint}${paramString ? `?${paramString}` : ''}`;
        return axios.get<ResponseType>(url, config || axiosJsonConfig);
    },
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType) => {
        return axios.post<ResponseType>(endpoint, data, axiosJsonConfig);
    },
    uploadFile: (endpoint: ApiEndpoint, file: File) => {
        const formData = new FormData();
        formData.append('vedlegg', file);
        return sendMultipartPostRequest(endpoint, formData);
    },
    deleteFile: (url: string) => axios.delete(url, axiosJsonConfig),
};

export default api;
