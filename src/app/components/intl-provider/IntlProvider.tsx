import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import bostedMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import tidsperiodeMessages from '@navikt/sif-common-forms/lib/tidsperiode/tidsperiodeMessages';
import utenlandsoppholdMessages from '@navikt/sif-common-forms/lib/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '@navikt/sif-common-forms/lib/virksomhet/virksomhetMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
import arbeidstidMessages from '../../soknad/arbeidstid-step/shared/arbeidstid-variert/arbeidstidVariertMessages';
import opptjeningUtlandMessages from '../pre-common/opptjening-utland/opptjeningUtlandMessages';

const introFormMessages = require('../../pages/intro-page/introFormMessagesNB.json');
export const appBokmålstekster = require('../../i18n/nb.json');

const bokmålstekster = {
    ...introFormMessages,
    ...allCommonMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...bostedMessages.nb,
    ...virksomhetMessages.nb,
    ...tidsperiodeMessages.nb,
    ...arbeidstidMessages.nb,
    ...sifCommonPleiepengerMessages.nb,
    ...appBokmålstekster,
    ...opptjeningUtlandMessages.nb,
};

export interface IntlProviderProps {
    locale: Locale;
    children: React.ReactNode;
    onError?: (error: any) => void;
}

const IntlProvider = ({ locale, onError, children }: IntlProviderProps) => {
    // const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={bokmålstekster} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
