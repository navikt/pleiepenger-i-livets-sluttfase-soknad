import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { SoknadFormData } from '../types/SoknadFormData';
import { AxiosResponse } from 'axios';
import { axiosJsonConfig } from '../config/axiosConfig';
import hash from 'object-hash';
import { StepID } from './soknadStepsConfig';
import { Person } from '../types/Søkerdata';
import { ApiEndpoint } from '../types/ApiEndpoint';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';

export const STORAGE_VERSION = '1.0';

interface UserHashInfo {
    søker: Person;
}

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTempStorageData>, 'update'> {
    update: (
        soknadId: string,
        formData: Partial<SoknadFormData>,
        lastStepID: StepID,
        søkerInfo: UserHashInfo
    ) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTempStorageData>({
    url: ApiEndpoint.MELLOMLAGRING,
    requestConfig: { ...axiosJsonConfig },
});

export const isStorageDataValid = (
    data: SoknadTempStorageData,
    userHashInfo: UserHashInfo
): SoknadTempStorageData | undefined => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        data.metadata.soknadId !== undefined &&
        JSON.stringify(data.formData) !== JSON.stringify({}) &&
        hash(userHashInfo) === data.metadata.userHash
    ) {
        return data;
    }
    return undefined;
};

const SøknadTempStorage: SoknadTemporaryStorage = {
    update: (soknadId: string, formData: SoknadFormData, lastStepID: StepID, userHashInfo: UserHashInfo) => {
        return persistSetup.update({
            formData,
            metadata: { soknadId, lastStepID, version: STORAGE_VERSION, userHash: hash(userHashInfo) },
        });
    },
    create: persistSetup.create,
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default SøknadTempStorage;
