import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';

export const mapFormDataToApiData = (locale = 'nb', formData: SoknadFormData): SoknadApiData | undefined => {
    try {
        const apiData: SoknadApiData = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            pleietrengendePerson: {
                fornavn: formData.gjeldendePerson.fornavn,
                etternavn: formData.gjeldendePerson.etternavn,
                adresse: formData.gjeldendePerson.adresse,
                postnummer: formData.gjeldendePerson.postnummer,
                poststed: formData.gjeldendePerson.poststed,
                fødselsnummer: formData.gjeldendePerson.fødselsnummer,
            },
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
