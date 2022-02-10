import getArbeidsgiver from '../api/getArbeidsgiver';
import { AxiosResponse } from 'axios';
import { Arbeidsgiver, ArbeidsgiverResponse } from '../types/Arbeidsgiver';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { relocateToLoginPage } from './navigationUtils';
import appSentryLogger from './appSentryLogger';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdTypes';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const getArbeidsgivere = async (
    fromDate: Date,
    toDate: Date
): Promise<AxiosResponse<ArbeidsgiverResponse> | null> => {
    try {
        const response: AxiosResponse<ArbeidsgiverResponse> = await getArbeidsgiver(
            formatDateToApiFormat(fromDate),
            formatDateToApiFormat(toDate)
        );
        return response;
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
        return null;
    }
};

export const syncArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: ArbeidsforholdFormData[]
): ArbeidsforholdFormData[] => {
    const arbeidsforholdUpdatedList: ArbeidsforholdFormData[] = arbeidsgivere.map((arbeidsgiver: Arbeidsgiver) => {
        const a: ArbeidsforholdFormData | undefined = arbeidsforhold.find(
            (f) => f.organisasjonsnummer === arbeidsgiver.organisasjonsnummer
        );

        return {
            ...arbeidsgiver,
            harHattFraværHosArbeidsgiver: a ? a.harHattFraværHosArbeidsgiver : YesOrNo.UNANSWERED,
        };
    });
    return arbeidsforholdUpdatedList;
};
