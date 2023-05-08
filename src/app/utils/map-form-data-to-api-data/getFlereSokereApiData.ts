import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { FlereSokereApiData } from '../../types/SoknadApiData';

export const getFlereSokereApiData = (flereSokereSvar: YesOrNo): FlereSokereApiData => {
    switch (flereSokereSvar) {
        case YesOrNo.YES:
            return FlereSokereApiData.JA;
        case YesOrNo.NO:
            return FlereSokereApiData.NEI;
        default:
            return FlereSokereApiData.USIKKER;
    }
};
