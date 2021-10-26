import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Frilans } from '../../types/SoknadApiData';

export const mapFrilansToApiData = (
    erFrilanser: YesOrNo,
    jobberFortsattSomFrilans: YesOrNo | undefined,
    startdato: string | undefined,
    sluttdato: string | undefined
): Frilans | undefined => {
    const startDate = datepickerUtils.getDateFromDateString(startdato);
    const endDate = datepickerUtils.getDateFromDateString(sluttdato);

    if (erFrilanser === YesOrNo.YES && startDate) {
        if (jobberFortsattSomFrilans === YesOrNo.NO && endDate === undefined) {
            return undefined;
        }
        const frilans: Frilans = {
            startdato: formatDateToApiFormat(startDate),
            jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
            sluttdato: endDate ? formatDateToApiFormat(endDate) : undefined,
        };
        return frilans;
    }
    return undefined;
};
