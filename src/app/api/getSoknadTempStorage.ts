import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import SoknadTempStorage from '../soknad/SoknadTempStorage';
import { AxiosError } from 'axios';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

type SoknadTempStorageRemoteData = RemoteData<AxiosError<any>, SoknadTempStorageData>;

const getSoknadTempStorage = async (): Promise<SoknadTempStorageRemoteData> => {
    try {
        const { data } = await SoknadTempStorage.rehydrate();
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSoknadTempStorage;
