import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadFormData } from '../types/SoknadFormData';
import { validateFødselsnummer, validateNavn } from './fieldValidation';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SoknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmPleietrengendeStepIsValid = ({ pleietrengende }: SoknadFormData): boolean =>
    validateNavn(pleietrengende.navn) === undefined &&
    validateFødselsnummer(pleietrengende.norskIdentitetsnummer) === undefined;

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: SoknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const arbeidssituasjonStepIsValid = () => true;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SoknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);
