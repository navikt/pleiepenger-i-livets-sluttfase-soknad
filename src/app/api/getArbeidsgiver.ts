import { RemoteData } from '@devexperts/remote-data-ts';
import { ArbeidsgiverResponse } from '../types/Arbeidsgiver';
import { AxiosError, AxiosResponse } from 'axios';
import api, { ApiEndpoint } from './api';

//TODO: slett
export type ArbeidsgiverRemoteData = RemoteData<AxiosError, ArbeidsgiverResponse>;

export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<ArbeidsgiverResponse>> => {
    const paramString = `fra_og_med=${fom}&til_og_med=${tom}`;
    return api.get(ApiEndpoint.arbeidsgiver, paramString);
};

export default getArbeidsgiver;
