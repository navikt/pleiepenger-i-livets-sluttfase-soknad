import { ArbeidsgiverApiData } from './SoknadApiData';
export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsgivere: ArbeidsgiverApiData[];
}
