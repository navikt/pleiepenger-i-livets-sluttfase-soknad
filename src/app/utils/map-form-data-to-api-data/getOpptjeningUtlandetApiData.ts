import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getCountryName } from '@navikt/sif-common-formik';
import { OpptjeningUtland } from '../../components/pre-common/opptjening-utland';
import { OpptjeningIUtlandetApi } from '../../types/SoknadApiData';

export const getOpptjeningIUtlandetApiData = (
    opptjeningUtland: OpptjeningUtland[],
    locale: string
): OpptjeningIUtlandetApi[] | undefined => {
    if (opptjeningUtland.length === 0) {
        return undefined;
    }

    const apiData: OpptjeningIUtlandetApi[] = opptjeningUtland.map((opptjening) => ({
        navn: opptjening.navn,
        opptjeningType: opptjening.opptjeningType,
        land: {
            landnavn: getCountryName(opptjening.landkode, locale),
            landkode: opptjening.landkode,
        },
        fraOgMed: formatDateToApiFormat(opptjening.fom),
        tilOgMed: formatDateToApiFormat(opptjening.tom),
    }));

    return apiData;
};
