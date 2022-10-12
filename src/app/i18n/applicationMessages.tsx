import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import bostedMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import tidsperiodeMessages from '@navikt/sif-common-forms/lib/tidsperiode/tidsperiodeMessages';
import utenlandsoppholdMessages from '@navikt/sif-common-forms/lib/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '@navikt/sif-common-forms/lib/virksomhet/virksomhetMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
import arbeidstidMessages from '../soknad/arbeidstid-step/shared/arbeidstid-variert/arbeidstidVariertMessages';
import utenlandskNæringMessages from '@navikt/sif-common-forms/lib/utenlandsk-næring/utenlandskNæringMessages';
import opptjeningUtlandMessages from '@navikt/sif-common-forms/lib/opptjening-utland/opptjeningUtlandMessages';
import ferieuttakMessages from '@navikt/sif-common-forms/lib/ferieuttak/ferieuttakMessages';
import soknadIntlMessages from '@navikt/sif-common-soknad/lib/soknad-intl-messages/soknadIntlMessages';

const introFormMessages = require('../pages/intro-page/introFormMessagesNB.json');
export const appBokmålstekster = require('./nb.json');
export const appNynorsktekster = require('./nn.json');

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
    ...utenlandskNæringMessages.nb,
    ...ferieuttakMessages.nb,
    ...soknadIntlMessages.nb,
};

const nynorsktekster = {
    ...introFormMessages,
    ...allCommonMessages.nn,
    ...utenlandsoppholdMessages.nn,
    ...bostedMessages.nn,
    ...virksomhetMessages.nn,
    ...tidsperiodeMessages.nn,
    ...appNynorsktekster,
    ...opptjeningUtlandMessages.nn,
    ...utenlandskNæringMessages.nn,
    ...ferieuttakMessages.nn,
    ...soknadIntlMessages.nn,
};

const getIntlMessages = (): MessageFileFormat => {
    if (isFeatureEnabled(Feature.NYNORSK)) {
        return {
            nb: bokmålstekster,
            nn: nynorsktekster,
        };
    } else {
        return {
            nb: bokmålstekster,
        };
    }
};

export const applicationIntlMessages = getIntlMessages();
