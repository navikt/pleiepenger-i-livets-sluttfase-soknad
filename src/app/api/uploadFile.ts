import api, { ApiEndpoint } from './api';

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return api.post(ApiEndpoint.uploadFile, formData, multipartConfig);
};
