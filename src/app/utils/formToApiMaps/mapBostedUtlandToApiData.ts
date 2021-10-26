import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { BostedUtland } from '@navikt/sif-common-forms/lib';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { UtenlandsoppholdApiData } from '../../types/SoknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): UtenlandsoppholdApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom),
    erEØSLand: countryIsMemberOfEøsOrEfta(opphold.landkode),
});
