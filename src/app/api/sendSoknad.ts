import { SoknadApiData } from '../types/SoknadApiData';
import { ApiEndpoint } from '../types/ApiEndpoint';
import api from './api';

export const sendSoknad = (data: SoknadApiData) => api.post(ApiEndpoint.SEND_SØKNAD, data);
