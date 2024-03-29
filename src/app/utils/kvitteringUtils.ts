import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { KvitteringInfo } from '../types/KvitteringInfo';
import { Person } from '../types/Søkerdata';
import { SoknadApiData } from '../types/SoknadApiData';

export type KvitteringApiData = Pick<SoknadApiData, 'arbeidsgivere' | 'fraOgMed' | 'tilOgMed'>;

export const getKvitteringInfoFromApiData = (
    { arbeidsgivere, fraOgMed, tilOgMed }: KvitteringApiData,
    søker: Person
): KvitteringInfo | undefined => {
    const arbeidsgivereISøknadsperiode = (arbeidsgivere || [])?.filter(
        (a) => a.arbeidsforhold !== undefined && a.sluttetFørSøknadsperiode !== true
    );
    if (arbeidsgivereISøknadsperiode.length > 0) {
        const { fornavn, mellomnavn, etternavn } = søker;
        return {
            arbeidsgivere: arbeidsgivereISøknadsperiode,
            fom: apiStringDateToDate(fraOgMed),
            tom: apiStringDateToDate(tilOgMed),
            søkernavn: formatName(fornavn, etternavn, mellomnavn),
        };
    }
    return undefined;
};
