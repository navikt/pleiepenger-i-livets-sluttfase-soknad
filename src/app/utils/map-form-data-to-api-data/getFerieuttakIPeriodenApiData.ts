import { SoknadFormData } from '../../types/SoknadFormData';
import { FerieuttakIPeriodenApiData } from '../../types/SoknadApiData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const getFerieuttakIPeriodenApiData = ({
    skalTaUtFerieIPerioden,
    ferieuttakIPerioden,
}: SoknadFormData): FerieuttakIPeriodenApiData | undefined => {
    if (skalTaUtFerieIPerioden === undefined) {
        throw Error('skalTaUtFerieIPerioden undefined');
    }

    if (
        skalTaUtFerieIPerioden === YesOrNo.YES &&
        (ferieuttakIPerioden === undefined || ferieuttakIPerioden.length === 0)
    ) {
        throw Error('Ferieuttak er tomt');
    }

    if (skalTaUtFerieIPerioden === YesOrNo.NO) {
        return {
            skalTaUtFerieIPerioden: false,
            ferieuttak: [],
        };
    }
    if (skalTaUtFerieIPerioden === YesOrNo.YES && ferieuttakIPerioden !== undefined) {
        return {
            skalTaUtFerieIPerioden: true,
            ferieuttak: ferieuttakIPerioden.map((uttak) => ({
                fraOgMed: formatDateToApiFormat(uttak.fom),
                tilOgMed: formatDateToApiFormat(uttak.tom),
            })),
        };
    }
    return undefined;
};
