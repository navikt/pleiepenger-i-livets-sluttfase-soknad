import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { BostedUtlandApiData, PeriodeApiData, UtenlandsoppholdIPeriodenApiData } from '../../types/SoknadApiData';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderFerieuttakIPeriodenSummary = (ferieuttak: PeriodeApiData): React.ReactNode => (
    <div className={bem.classNames(bem.block, bem.modifier('no-details'))}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.fraOgMed))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.tilOgMed))}
        </span>
    </div>
);

export const renderUtenlandsoppholdSummary = (opphold: BostedUtlandApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
        </span>
        <span className={bem.element('country')}>{opphold.landnavn}</span>
    </div>
);

export const renderUtenlandsoppholdIPeriodenSummary = (opphold: UtenlandsoppholdIPeriodenApiData): React.ReactNode => {
    return (
        <>
            <Box>
                <span className={bem.element('dates')}>
                    {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
                    {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
                </span>
                <span className={bem.element('country')}>{opphold.landnavn}</span>
            </Box>
        </>
    );
};
