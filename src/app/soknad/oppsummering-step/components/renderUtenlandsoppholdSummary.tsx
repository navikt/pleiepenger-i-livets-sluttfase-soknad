import React from 'react';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { BostedUtlandApiData } from '../../../types/SoknadApiData';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderUtenlandsoppholdIPeriodenSummary = (opphold: BostedUtlandApiData): React.ReactNode => {
    return (
        <div className={bem.block}>
            <span className={bem.element('dates')}>
                {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
                {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
            </span>
            <span className={bem.element('country')}>{opphold.landnavn}</span>
        </div>
    );
};
