import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { FrilansFormData, SelvstendigFormData } from '../../types/SoknadFormData';

export const frilansIsValid = (formData: FrilansFormData) => {
    const erFrilanser: YesOrNo = formData.frilans_erFrilanser;
    const frilansStartdato: Date | undefined = datepickerUtils.getDateFromDateString(formData.frilans_startdato);
    const frilansSluttdato: Date | undefined = datepickerUtils.getDateFromDateString(formData.frilans_sluttdato);
    const frilansJobberFortsattSomFrilans: YesOrNo | undefined = formData.frilans_jobberFortsattSomFrilans;

    return !!(
        erFrilanser === YesOrNo.NO ||
        (erFrilanser === YesOrNo.YES &&
            frilansStartdato &&
            (frilansJobberFortsattSomFrilans === YesOrNo.YES ||
                (frilansJobberFortsattSomFrilans === YesOrNo.NO && frilansSluttdato !== undefined)))
    );
};

export const selvstendigIsValid = (formData: SelvstendigFormData) => {
    const erSelvstendigNæringsdrivende: YesOrNo | undefined = formData.selvstendig_erSelvstendigNæringsdrivende;
    const selvstendigVirksomhet: Virksomhet | undefined = formData.selvstendig_virksomhet;
    return !!(
        erSelvstendigNæringsdrivende === YesOrNo.NO ||
        (erSelvstendigNæringsdrivende === YesOrNo.YES && selvstendigVirksomhet !== undefined)
    );
};
