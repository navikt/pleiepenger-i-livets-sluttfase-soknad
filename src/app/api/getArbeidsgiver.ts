import { AxiosResponse } from 'axios';
import { ApiEndpoint } from '../types/ApiEndpoint';
import api from './api';
import { failure } from '@devexperts/remote-data-ts';
import { ISODate, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver, ArbeidsgiverType } from '../types/Arbeidsgiver';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { relocateToLoginPage } from '../utils/navigationUtils';
import appSentryLogger from '../utils/appSentryLogger';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export type AAregArbeidsgiverRemoteData = {
    organisasjoner?: {
        organisasjonsnummer: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    privatarbeidsgiver?: {
        offentligIdent: string;
        navn: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
    frilansoppdrag?: {
        type: string;
        organisasjonsnummer?: string;
        offentligIdent?: string;
        navn?: string;
        ansattFom?: ISODate;
        ansattTom?: ISODate;
    }[];
};

const mapAAregArbeidsgiverRemoteDataToArbeidsiver = (data: AAregArbeidsgiverRemoteData): Arbeidsgiver[] => {
    const arbeidsgivere: Arbeidsgiver[] = [];
    data.organisasjoner?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.ORGANISASJON,
            id: a.organisasjonsnummer,
            organisasjonsnummer: a.organisasjonsnummer,
            navn: a.navn || a.organisasjonsnummer,
        });
    });
    data.privatarbeidsgiver?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.PRIVATPERSON,
            id: a.offentligIdent,
            offentligIdent: a.offentligIdent,
            navn: a.navn,
            ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
            ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
        });
    });
    data.frilansoppdrag?.forEach((a) => {
        arbeidsgivere.push({
            type: ArbeidsgiverType.FRILANSOPPDRAG,
            id: a.offentligIdent || a.organisasjonsnummer || 'ukjent',
            organisasjonsnummer: a.organisasjonsnummer,
            offentligIdent: a.offentligIdent,
            navn: a.navn || 'Frilansoppdrag',
            ansattFom: a.ansattFom ? ISODateToDate(a.ansattFom) : undefined,
            ansattTom: a.ansattTom ? ISODateToDate(a.ansattTom) : undefined,
        });
    });
    return arbeidsgivere;
};

const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<AAregArbeidsgiverRemoteData>> => {
    try {
        return api.get<AAregArbeidsgiverRemoteData>(
            ApiEndpoint.ARBEIDSGIVER,
            `ytelse=pleiepenger-livets-sluttfase&fra_og_med=${fom}&til_og_med=${tom}&frilansoppdrag=true`
        );
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export const getArbeidsgivereRemoteData = async (fromDate: Date, toDate: Date): Promise<Arbeidsgiver[]> => {
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const arbeidsgivere = mapAAregArbeidsgiverRemoteDataToArbeidsiver(response.data);
        return Promise.resolve(arbeidsgivere);
    } catch (error: any) {
        if (isUnauthorized(error)) {
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
        return Promise.reject([]);
    }
};
