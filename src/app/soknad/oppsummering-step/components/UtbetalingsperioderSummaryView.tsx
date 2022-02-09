import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { UtbetalingsperiodeApi } from '../../../types/SoknadApiData';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { ArbeidsforholdFormData } from 'app/types/ArbeidsforholdTypes';
import { ApiAktivitet } from '../../../types/AktivitetFravær';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
    arbeidsforhold: ArbeidsforholdFormData[];
}

const getFraværAktivitetString = (
    periode: UtbetalingsperiodeApi,
    arbeidsforhold: ArbeidsforholdFormData[],
    intl: IntlShape
) => {
    const getArbeidsgiverNavner = () => {
        return arbeidsforhold
            .filter((forhold) =>
                periode.organisasjonsnummer === null
                    ? []
                    : periode.organisasjonsnummer.find((nummer) => nummer === forhold.organisasjonsnummer) !== undefined
            )
            .map((f) => f.navn);
    };

    const getApiAktiviteter = () => periode.aktivitetFravær.filter((a) => a !== ApiAktivitet.ARBEIDSTAKER);
    const aktiviteterArray = [...getArbeidsgiverNavner(), ...getApiAktiviteter()];
    const aktiviteterString = aktiviteterArray.map((a) =>
        a === ApiAktivitet.FRILANSER ||
        a === ApiAktivitet.SELVSTENDIG_NÆRINGSDRIVENDE ||
        a === ApiAktivitet.STØNAD_FRA_NAV
            ? `${intlHelper(intl, `aktivitetFravær.${a}`)}`
            : `${a}`
    );
    return `${aktiviteterString.join(', ')}.`;
};

const renderEnkeltdagElement = (date: Date): JSX.Element => (
    <div>
        <span style={{ textTransform: 'capitalize' }}>{dayjs(date).format('dddd')}</span> {prettifyDate(date)}
    </div>
);

const renderFraværAktivitetElement = (
    periode: UtbetalingsperiodeApi,
    visAktivitet: boolean,
    arbeidsforhold: ArbeidsforholdFormData[],
    intl: IntlShape
): JSX.Element | null => (visAktivitet ? <div>{getFraværAktivitetString(periode, arbeidsforhold, intl)}</div> : null);

const renderUtbetalingsperiode = (
    periode: UtbetalingsperiodeApi,
    visAktivitet: boolean,
    arbeidsforhold: ArbeidsforholdFormData[],
    intl: IntlShape
): JSX.Element => {
    const fom = apiStringDateToDate(periode.fraOgMed);
    const tom = apiStringDateToDate(periode.tilOgMed);

    return (
        <div style={{ marginBottom: '.5rem' }}>
            {periode.fraOgMed === periode.tilOgMed ? (
                <div>
                    {renderEnkeltdagElement(fom)}
                    {renderFraværAktivitetElement(periode, visAktivitet, arbeidsforhold, intl)}
                </div>
            ) : (
                <div>
                    Fra og med {prettifyDate(fom)}, til og med {prettifyDate(tom)}
                    {renderFraværAktivitetElement(periode, visAktivitet, arbeidsforhold, intl)}
                </div>
            )}
        </div>
    );
};

const harFlereFraværAktiviteter = (perioder: UtbetalingsperiodeApi[]) => {
    return (
        uniq(flatten(perioder.map((p) => p.aktivitetFravær))).length > 1 ||
        uniq(flatten(perioder.map((p) => p.organisasjonsnummer && p.organisasjonsnummer?.length > 1))).length > 1
    );
};

const UtbetalingsperioderSummaryView: React.FC<Props> = ({ utbetalingsperioder = [], arbeidsforhold }) => {
    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter((p) => p.tilOgMed !== undefined);
    const intl = useIntl();
    const visAktivitetInfo = harFlereFraværAktiviteter(utbetalingsperioder);
    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode) =>
                            renderUtbetalingsperiode(periode, visAktivitetInfo, arbeidsforhold, intl)
                        }
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
