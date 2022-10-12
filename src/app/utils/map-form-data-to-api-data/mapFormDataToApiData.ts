import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { listOfAttachmentsToListOfUrlStrings } from './mapVedleggToApiData';
import { IntlShape } from 'react-intl';
import { getMedlemsskapApiData } from '../medlemsskapApiData';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import appSentryLogger from '../appSentryLogger';
import { getUtenlandsoppholdIPeriodenApiData } from './getUtenlandsoppholdIPeriodenApiData';
import { getArbeidsgivereISøknadsperiodenApiData } from './getArbeidsgivereISøknadsperiodenApiData';
import { getFrilansApiData } from './getFrilansApiData';
import { getSelvstendigNæringsdrivendeApiData } from './getSelvstendigNæringsdrivendeApiData';
import { getOpptjeningIUtlandetApiData } from './getOpptjeningUtlandetApiData';
import { getUtenlandskNæringApiData } from './getUtenlandskNæringApiData';
import { getLocaleForApi } from '@navikt/sif-common-core/lib/utils/localeUtils';
import { getFerieuttakIPeriodenApiData } from './getFerieuttakIPeriodenApiData';

export const mapFormDataToApiData = (formData: SoknadFormData, intl: IntlShape): SoknadApiData | undefined => {
    const periodeFra = datepickerUtils.getDateFromDateString(formData.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(formData.periodeTil);

    if (periodeFra && periodeTil) {
        try {
            const sprak = getLocaleForApi(intl.locale);
            const søknadsperiode: DateRange = {
                from: periodeFra,
                to: periodeTil,
            };
            const apiData: SoknadApiData = {
                språk: sprak,
                harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
                pleietrengende: {
                    navn: formData.pleietrengende.navn,
                    norskIdentitetsnummer: formData.pleietrengende.norskIdentitetsnummer
                        ? formData.pleietrengende.norskIdentitetsnummer
                        : null,
                    årsakManglerIdentitetsnummer: formData.pleietrengende.årsakManglerIdentitetsnummer
                        ? formData.pleietrengende.årsakManglerIdentitetsnummer
                        : null,
                    fødselsdato: formData.pleietrengende.fødselsdato ? formData.pleietrengende.fødselsdato : null,
                },
                fraOgMed: formatDateToApiFormat(periodeFra),
                tilOgMed: formatDateToApiFormat(periodeTil),
                utenlandsoppholdIPerioden: {
                    skalOppholdeSegIUtlandetIPerioden: formData.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES,
                    opphold:
                        formData.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && formData.utenlandsoppholdIPerioden
                            ? formData.utenlandsoppholdIPerioden.map((o) =>
                                  getUtenlandsoppholdIPeriodenApiData(o, sprak)
                              )
                            : [],
                },
                ferieuttakIPerioden: getFerieuttakIPeriodenApiData(formData),
                ...getArbeidsgivereISøknadsperiodenApiData(formData, søknadsperiode),
                ...getFrilansApiData(formData.frilans, søknadsperiode, formData.frilansoppdrag),
                ...getSelvstendigNæringsdrivendeApiData(formData.selvstendig, søknadsperiode, sprak),
                ...getMedlemsskapApiData(formData, sprak),
                harVærtEllerErVernepliktig: formData.harVærtEllerErVernepliktig
                    ? formData.harVærtEllerErVernepliktig === YesOrNo.YES
                    : undefined,
                opptjeningIUtlandet: getOpptjeningIUtlandetApiData(formData.opptjeningUtland, sprak),
                utenlandskNæring: getUtenlandskNæringApiData(formData.utenlandskNæring, sprak),
                vedleggUrls: listOfAttachmentsToListOfUrlStrings(formData.bekreftelseFraLege),
                opplastetIdVedleggUrls: listOfAttachmentsToListOfUrlStrings(formData.pleietrengendeId),
                _attachments: formData.bekreftelseFraLege,
            };
            return apiData;
        } catch (error) {
            console.error('mapFormDataToApiData failed', error);
            return undefined;
        }
    } else {
        appSentryLogger.logError(
            'mapFormDataToApiData failed - empty periode',
            JSON.stringify({ periodeFra, periodeTil })
        );
        return undefined;
    }
};
