import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getCountryName } from '@navikt/sif-common-formik';
import { UtenlandskNæring } from '../../components/pre-common/utenlandsk-næring';
import { UtenlandskNæringApi } from '../../types/SoknadApiData';

export const getUtenlandskNæringApiData = (
    utenlandskNæring: UtenlandskNæring[],
    locale: string
): UtenlandskNæringApi[] => {
    if (!utenlandskNæring || utenlandskNæring.length === 0) {
        return [];
    }

    const apiData: UtenlandskNæringApi[] = utenlandskNæring.map((næring) => ({
        næringstype: næring.næringstype,
        navnPåVirksomheten: næring.navnPåVirksomheten,
        organisasjonsnummer: næring.identifikasjonsnummer ? næring.identifikasjonsnummer : undefined,
        land: {
            landnavn: getCountryName(næring.land, locale),
            landkode: næring.land,
        },
        fraOgMed: formatDateToApiFormat(næring.fraOgMed),
        tilOgMed: næring.tilOgMed ? formatDateToApiFormat(næring.tilOgMed) : undefined,
    }));

    return apiData;
};
