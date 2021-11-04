import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime, timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { timeText } from '@navikt/sif-common-forms/lib/fravær';
import dayjs from 'dayjs';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
// import { ApiAktivitet } from '../../../types/AktivitetFravær';
import { UtbetalingsperiodeApi } from '../../../types/SoknadApiData';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { ArbeidsforholdFormData } from 'app/types/ArbeidsforholdTypes';
import { ApiAktivitet } from '../../../types/AktivitetFravær';

export interface Props {
    utbetalingsperioder: UtbetalingsperiodeApi[];
    arbeidsforhold: ArbeidsforholdFormData[];
}

type UtbetalingsperiodeDag = Omit<
    UtbetalingsperiodeApi,
    'fraOgMed' | 'tilOgMed' | 'antallTimerPlanlagt' | 'antallTimerBorte'
> & {
    dato: string;
    antallTimerPlanlagt: Time;
    antallTimerBorte: Time;
};

export const isTime = (value: any): value is Time => {
    return value && value.hours !== undefined && value.minutes !== undefined;
};

export const isUtbetalingsperiodeDag = (p: any): p is UtbetalingsperiodeDag =>
    p && p.fraOgMed && p.antallTimerBorte !== null && p.antallTimerPlanlagt !== null;

export const toMaybeUtbetalingsperiodeDag = (p: UtbetalingsperiodeApi): UtbetalingsperiodeDag | null => {
    if (isUtbetalingsperiodeDag(p)) {
        const antallTimerPlanlagtTime: Partial<Time> | undefined = iso8601DurationToTime(p.antallTimerPlanlagt);
        const antallTimerBorteTime = iso8601DurationToTime(p.antallTimerBorte);
        if (isTime(antallTimerPlanlagtTime) && isTime(antallTimerBorteTime)) {
            return {
                dato: p.fraOgMed,
                antallTimerPlanlagt: antallTimerPlanlagtTime,
                antallTimerBorte: antallTimerBorteTime,
                aktivitetFravær: p.aktivitetFravær,
                organisasjonsnummer: p.organisasjonsnummer,
            };
        }
    }
    return null;
};

export const outNull = (
    maybeUtbetalingsperiodeDag: UtbetalingsperiodeDag | null
): maybeUtbetalingsperiodeDag is UtbetalingsperiodeDag => maybeUtbetalingsperiodeDag !== null;

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
    const aString = '';
    const aktiviteterString = aktiviteterArray.map((a) => {
        console.log(ApiAktivitet.FRILANSER);
        const aktivitet =
            a === ApiAktivitet.FRILANSER || a === ApiAktivitet.SELVSTENDIG_NÆRINGSDRIVENDE
                ? `${intlHelper(intl, `aktivitetFravær.${a}`)}, `
                : `${a}, `;
        return aString.concat(aktivitet);
    });
    return aktiviteterString;
    /*return periode.aktivitetFravær.length === 2
        ? intlHelper(intl, `step.oppsummering.fravær.aktivitet.2`, {
              aktivitet1: intlHelper(intl, `aktivitetFravær.${aktivitetFravær[0]}`),
              aktivitet2: intlHelper(intl, `aktivitetFravær.${aktivitetFravær[1]}`),
          })
        : intlHelper(intl, `step.oppsummering.fravær.aktivitet.1`, {
              aktivitet: intlHelper(intl, `aktivitetFravær.${aktivitetFravær[0]}`),
          });*/
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

export const renderUtbetalingsperiodeDag = (
    // dag: UtbetalingsperiodeDag,
    periode: UtbetalingsperiodeApi,
    visAktivitet: boolean,
    arbeidsforhold: ArbeidsforholdFormData[],
    intl: IntlShape
): JSX.Element => {
    //TODO
    const dag = periode as unknown as UtbetalingsperiodeDag;
    const antallTimerSkulleJobbet = `${timeToDecimalTime(dag.antallTimerPlanlagt)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerPlanlagt)}`
    )}`;
    const antallTimerBorteFraJobb = `${timeToDecimalTime(dag.antallTimerBorte)} ${timeText(
        `${timeToDecimalTime(dag.antallTimerBorte)}`
    )}`;
    return (
        <div style={{ marginBottom: '.5rem' }}>
            {renderEnkeltdagElement(apiStringDateToDate(dag.dato))}
            Skulle jobbet {antallTimerSkulleJobbet}. Borte fra jobb {antallTimerBorteFraJobb}.
            {renderFraværAktivitetElement(periode, visAktivitet, arbeidsforhold, intl)}
        </div>
    );
};

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
    return uniq(flatten(perioder.map((p) => p.aktivitetFravær))).length > 1;
};

const UtbetalingsperioderSummaryView: React.FC<Props> = ({ utbetalingsperioder = [], arbeidsforhold }) => {
    const perioder: UtbetalingsperiodeApi[] = utbetalingsperioder.filter(
        (p) => p.tilOgMed !== undefined && p.antallTimerBorte === null
    );
    const intl = useIntl();
    const dager: UtbetalingsperiodeDag[] = utbetalingsperioder.map(toMaybeUtbetalingsperiodeDag).filter(outNull);
    const visAktivitetInfo = harFlereFraværAktiviteter(utbetalingsperioder);

    return (
        <>
            {perioder.length > 0 && (
                <SummaryBlock header={'Hele dager med fravær'}>
                    <SummaryList
                        items={perioder}
                        itemRenderer={(periode) =>
                            renderUtbetalingsperiode(periode, visAktivitetInfo, arbeidsforhold, intl)
                        }
                    />
                </SummaryBlock>
            )}
            {dager.length > 0 && (
                <SummaryBlock header={'Dager med delvis fravær'}>
                    <SummaryList
                        items={dager}
                        itemRenderer={(dag: UtbetalingsperiodeDag) =>
                            renderUtbetalingsperiodeDag(
                                dag as unknown as UtbetalingsperiodeApi,
                                visAktivitetInfo,
                                arbeidsforhold,
                                intl
                            )
                        }
                    />
                </SummaryBlock>
            )}
        </>
    );
};

export default UtbetalingsperioderSummaryView;
