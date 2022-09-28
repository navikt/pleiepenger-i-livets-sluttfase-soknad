import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from './SoknadFormData';

export const MELLOMLAGRING_VERSION = '4';

interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: Partial<SoknadFormData>;
}
