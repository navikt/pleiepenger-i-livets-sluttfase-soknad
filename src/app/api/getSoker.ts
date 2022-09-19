import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { Person } from '../types/Søkerdata';
import api from './api';

export type SokerRemoteData = RemoteData<AxiosError, Person>;

const getSokerRemoteData = async (): Promise<SokerRemoteData> => {
    try {
        const { data } = await api.get<Person>(ApiEndpoint.SØKER, 'ytelse=pleiepenger-livets-sluttfase');
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSokerRemoteData;
