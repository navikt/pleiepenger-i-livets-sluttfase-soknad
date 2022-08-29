import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { SelvstendigFormData } from '../../types/SelvstendigFormData';
import { SoknadApiData } from '../../types/SoknadApiData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';
import { erSNISøknadsperiode } from '../selvstendigUtils';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    SoknadApiData,
    'selvstendigNæringsdrivende' | '_harHattInntektSomSelvstendigNæringsdrivende'
>;

export const getSelvstendigNæringsdrivendeApiData = (
    { arbeidsforhold, harHattInntektSomSN, harFlereVirksomheter, virksomhet }: SelvstendigFormData,
    søknadsperiode: DateRange,
    locale: Locale
): SelvstendigArbeidsforholdApiDataPart => {
    const _harHattInntektSomSelvstendigNæringsdrivende = harHattInntektSomSN === YesOrNo.YES;

    if (_harHattInntektSomSelvstendigNæringsdrivende === false || !virksomhet || !arbeidsforhold) {
        return {
            _harHattInntektSomSelvstendigNæringsdrivende,
        };
    }

    if (
        !erSNISøknadsperiode(søknadsperiode, { arbeidsforhold, harHattInntektSomSN, harFlereVirksomheter, virksomhet })
    ) {
        return {
            _harHattInntektSomSelvstendigNæringsdrivende,
        };
    }

    return {
        _harHattInntektSomSelvstendigNæringsdrivende,
        selvstendigNæringsdrivende: {
            arbeidsforhold: mapArbeidsforholdToApiData(arbeidsforhold, søknadsperiode),
            virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter === YesOrNo.YES),
        },
    };
};
