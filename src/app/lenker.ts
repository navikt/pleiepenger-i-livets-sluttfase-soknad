interface Lenker {
    navno: string;
    personvern: string;
    rettOgPlikt: string;
    saksbehandlingstider: string;
    medlemskap: string;
    søknadPåPapir: string;
}

const LenkerBokmål: Lenker = {
    navno: 'https://www.nav.no/',
    personvern:
        'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten/personvernerkl%C3%A6ring-for-arbeids-og-velferdsetaten',
    rettOgPlikt: 'https://nav.no/rettOgPlikt',
    saksbehandlingstider: 'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/Saksbehandlingstider+i+NAV',
    medlemskap:
        'https://www.nav.no/no/Person/Flere+tema/Arbeid+og+opphold+i+Norge/Relatert+informasjon/medlemskap-i-folketrygden',
    søknadPåPapir: 'https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger#NAV091205',
};

const getLenker = (locale?: string): Lenker => {
    switch (locale) {
        case 'nn':
            return {
                ...LenkerBokmål,
            };
        default:
            return LenkerBokmål;
    }
};

export default getLenker;
