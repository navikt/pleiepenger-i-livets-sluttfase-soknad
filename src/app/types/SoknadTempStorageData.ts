import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from './SoknadFormData';

export const MELLOMLAGRING_VERSION = '5.0';
export interface SoknadTempStorageData {
    metadata: {
        soknadId: string;
        lastStepID: StepID;
        version: string;
        userHash: string;
    };
    formData: SoknadFormData;
}
