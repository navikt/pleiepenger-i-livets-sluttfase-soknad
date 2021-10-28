import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { ArbeidsgiverResponse } from '../types/Arbeidsgiver';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from './api';

export type ArbeidsgiverRemoteData = RemoteData<AxiosError, ArbeidsgiverResponse>;

const getArbeidsgiverRemoteData = async (fom: string, tom: string): Promise<ArbeidsgiverRemoteData> => {
    const paramString = `fra_og_med=${fom}&til_og_med=${tom}`;
    try {
        const { data } = await api.get<ArbeidsgiverResponse>(ApiEndpoint.arbeidsgiver, paramString);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgiverRemoteData;
