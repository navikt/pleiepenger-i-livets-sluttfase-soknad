import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { Arbeidsgiver } from '../../types';
import { FrilansFormData } from '../../types/FrilansFormData';
import { FrilansApiData, SoknadApiData } from '../../types/SoknadApiData';
import { erFrilanserITidsrom } from '../frilanserUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export type FrilansApiDataPart = Pick<SoknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

export const getFrilansApiData = (
    formData: FrilansFormData,
    søknadsperiode: DateRange,
    frilansoppdrag: Arbeidsgiver[] = []
): FrilansApiDataPart => {
    const { harHattInntektSomFrilanser, jobberFortsattSomFrilans, startdato, sluttdato } = formData;
    const _harHattInntektSomFrilanser = harHattInntektSomFrilanser === YesOrNo.YES;
    const from = datepickerUtils.getDateFromDateString(startdato);
    const to = datepickerUtils.getDateFromDateString(sluttdato);

    if (
        (_harHattInntektSomFrilanser === false && frilansoppdrag.length === 0) ||
        startdato === undefined ||
        from === undefined
    ) {
        return {
            _harHattInntektSomFrilanser: false,
        };
    }

    if (erFrilanserITidsrom(søknadsperiode, from, to) === false) {
        return {
            _harHattInntektSomFrilanser: false,
            frilans: {
                harHattInntektSomFrilanser: false,
                startdato,
                jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
                sluttdato,
            },
        };
    }

    const arbeidsforholdApiData = formData.arbeidsforhold
        ? mapArbeidsforholdToApiData(formData.arbeidsforhold, søknadsperiode)
        : undefined;

    const frilansApiData: FrilansApiData = {
        harHattInntektSomFrilanser: true,
        startdato: startdato,
        jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
        sluttdato: sluttdato,
        arbeidsforhold: arbeidsforholdApiData,
    };

    return {
        _harHattInntektSomFrilanser,
        frilans: frilansApiData,
    };
};
