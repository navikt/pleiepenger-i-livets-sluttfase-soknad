import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadFormData } from '../../types/SoknadFormData';
import { initialSoknadFormData } from '../initialSoknadValues';

export const cleanupArbeidssituasjonStep = (values: SoknadFormData): SoknadFormData => {
    const { frilans_erFrilanser, selvstendig_erSelvstendigNæringsdrivende } = values;
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

    return cleanedValues;
};
