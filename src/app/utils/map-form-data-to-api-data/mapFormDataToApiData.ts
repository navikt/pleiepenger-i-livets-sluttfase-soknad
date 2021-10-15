import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';

export const mapFormDataToApiData = (locale = 'nb', formData: SoknadFormData): SoknadApiData | undefined => {
    try {
        const apiData: SoknadApiData = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            gjeldendePerson: {
                navn: formData.gjeldendePerson.navn,
                fødselsnummer: formData.gjeldendePerson.fødselsnummer,
                fødselsdato: formData.gjeldendePerson.fødselsdato,
            },
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
