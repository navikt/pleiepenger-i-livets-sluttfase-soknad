import { JobberIPeriodeSvar } from '../../../types/JobberIPeriodenSvar';
import { Arbeidsforhold } from '../../../types/Arbeidsforhold';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';

export const harFraværIPerioden = (
    ansatt_arbeidsforhold: Arbeidsforhold[],
    frilans: FrilansFormData,
    selvstendig: SelvstendigFormData
): boolean => {
    const ansattArbeidIPeriode = ansatt_arbeidsforhold.some(
        (forhold) =>
            forhold.arbeidIPeriode !== undefined &&
            forhold.arbeidIPeriode.jobberIPerioden !== JobberIPeriodeSvar.somVanlig
    );
    const frilansArbeidIPeriode = frilans.arbeidsforhold?.arbeidIPeriode?.jobberIPerioden;
    const selvstendigArbeidIPeriode = selvstendig?.arbeidsforhold?.arbeidIPeriode?.jobberIPerioden;

    return (
        (frilansArbeidIPeriode !== undefined && frilansArbeidIPeriode !== JobberIPeriodeSvar.somVanlig) ||
        (selvstendigArbeidIPeriode !== undefined && selvstendigArbeidIPeriode !== JobberIPeriodeSvar.somVanlig) ||
        ansattArbeidIPeriode
    );
};
