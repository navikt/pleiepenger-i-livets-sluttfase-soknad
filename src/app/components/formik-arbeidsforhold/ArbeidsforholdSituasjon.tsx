import * as React from 'react';
import { useIntl } from 'react-intl';
import { ArbeidsforholdFormDataFields } from '../../types/ArbeidsforholdTypes';
// import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    parentFieldName: string;
    organisasjonsnavn: string;
}

const ArbeidsforholdSituasjon: React.FC<Props> = ({ parentFieldName, organisasjonsnavn }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdFormDataFields) =>
        `${parentFieldName}.${field}` as unknown as ArbeidsforholdFormDataFields;
    return (
        <>
            <FormBlock margin="none">
                <FormikYesOrNoQuestion
                    legend={intlHelper(intl, 'step.arbeidssituasjon.arbeidsforhold.harHattFravær.spm', {
                        organisasjonsnavn,
                    })}
                    name={getFieldName(ArbeidsforholdFormDataFields.harHattFraværHosArbeidsgiver)}
                    // TODO
                    // validate={getRequiredFieldValidator}
                />
            </FormBlock>
        </>
    );
};

export default ArbeidsforholdSituasjon;
