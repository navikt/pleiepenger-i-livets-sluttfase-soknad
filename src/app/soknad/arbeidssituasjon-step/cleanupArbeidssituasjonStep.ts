import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsgiver } from '../../types/Arbeidsgiver';
import { SoknadFormData } from '../../types/SoknadFormData';
import { initialSoknadFormData } from '../initialSoknadValues';

export const cleanupArbeidssituasjonStep = (values: SoknadFormData, arbeidsgivere: Arbeidsgiver[]): SoknadFormData => {
    const { frilans_erFrilanser, selvstendig_erSelvstendigNæringsdrivende, arbeidsforhold } = values;
    const cleanedValues = { ...values };

    // Cleanup frilanser
    if (frilans_erFrilanser === YesOrNo.NO) {
        cleanedValues.frilans_jobberFortsattSomFrilans = initialSoknadFormData.frilans_jobberFortsattSomFrilans;
        cleanedValues.frilans_startdato = initialSoknadFormData.frilans_startdato;
        cleanedValues.frilans_sluttdato = initialSoknadFormData.frilans_sluttdato;
    } else {
        if (values.frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
            cleanedValues.frilans_sluttdato = initialSoknadFormData.frilans_sluttdato;
        }
    }
    // Cleanup selvstendig næringsdrivende
    if (selvstendig_erSelvstendigNæringsdrivende === YesOrNo.NO) {
        cleanedValues.selvstendig_virksomhet = undefined;
        cleanedValues.selvstendig_harFlereVirksomheter = undefined;
    }

    if (arbeidsgivere.length > 0 && arbeidsforhold.length > 0) {
        cleanedValues.arbeidsforhold = arbeidsforhold.map((forhold, index) => ({
            navn: arbeidsgivere[index].navn,
            organisasjonsnummer: arbeidsgivere[index].organisasjonsnummer,
            harHattFraværHosArbeidsgiver: forhold.harHattFraværHosArbeidsgiver,
        }));
    }

    return cleanedValues;
};
