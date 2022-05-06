import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadApiData, YesNoSpørsmålOgSvar, YesNoSvar } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { listOfAttachmentsToListOfUrlStrings } from './mapVedleggToApiData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { getValidSpråk } from '../sprakUtils';
import { getMedlemsskapApiData } from '../medlemsskapApiData';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import appSentryLogger from '../appSentryLogger';
import { getUtenlandsoppholdIPeriodenApiData } from './getUtenlandsoppholdIPeriodenApiData';
import { getArbeidsgivereISøknadsperiodenApiData } from './getArbeidsgivereISøknadsperiodenApiData';
import { getFrilansApiData } from './getFrilansApiData';
import { getSelvstendigNæringsdrivendeApiData } from './getSelvstendigNæringsdrivendeApiData';
import { getOpptjeningIUtlandetApiData } from './getOpptjeningUtlandetApiData';

export const mapYesOrNoToSvar = (input: YesOrNo): YesNoSvar => {
    return input === YesOrNo.YES;
};

export const mapFormDataToApiData = (formData: SoknadFormData, intl: IntlShape): SoknadApiData | undefined => {
    const locale = getValidSpråk(intl.locale);
    const yesOrNoQuestions: YesNoSpørsmålOgSvar[] = [];

    const periodeFra = datepickerUtils.getDateFromDateString(formData.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(formData.periodeTil);

    if (formData.frilans_erFrilanser) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.arbeidssituasjon.frilanser.erFrilanser.spm'),
            svar: mapYesOrNoToSvar(formData.frilans_erFrilanser),
        });
    }
    if (formData.selvstendig_erSelvstendigNæringsdrivende) {
        yesOrNoQuestions.push({
            spørsmål: intlHelper(intl, 'step.arbeidssituasjon.selvstendig.erDuSelvstendigNæringsdrivende.spm'),
            svar: mapYesOrNoToSvar(formData.selvstendig_erSelvstendigNæringsdrivende),
        });
    }

    if (periodeFra && periodeTil) {
        try {
            const sprak = getValidSpråk(locale);
            const søknadsperiode: DateRange = {
                from: periodeFra,
                to: periodeTil,
            };
            const apiData: SoknadApiData = {
                språk: locale,
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
                ...getArbeidsgivereISøknadsperiodenApiData(formData, søknadsperiode),
                ...getFrilansApiData(formData.frilans, søknadsperiode, formData.frilansoppdrag),
                ...getSelvstendigNæringsdrivendeApiData(formData.selvstendig, søknadsperiode, locale),
                ...getMedlemsskapApiData(formData, locale),
                opptjeningIUtlandet: getOpptjeningIUtlandetApiData(formData.opptjeningUtland, locale),
                vedleggUrls: listOfAttachmentsToListOfUrlStrings(formData.bekreftelseFraLege),
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
