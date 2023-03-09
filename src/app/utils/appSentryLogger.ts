import getSentryLoggerForApp from '@navikt/sif-common-sentry';

const appSentryLogger = getSentryLoggerForApp('pleiepenger-i-livets-sluttfase-soknad', ['sykdom-i-familien']);
export default appSentryLogger;
