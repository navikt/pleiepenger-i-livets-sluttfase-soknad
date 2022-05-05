import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndList,
    ModalFormAndListLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { OpptjeningUtland } from './types';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import OpptjeningUtlandForm from './OpptjeningUtlandForm';
import OpptjeningUtlandList from './OpptjeningUtlandList';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function OpptjeningUtlandListAndDialog<FieldNames>({ name, minDate, maxDate, validate, labels }: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, OpptjeningUtland, ValidationError>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item, allItems }) => (
                <OpptjeningUtlandForm
                    opptjening={item}
                    alleOpptjening={allItems}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
            listRenderer={({ items, onEdit, onDelete }) => (
                <OpptjeningUtlandList utenlandsopphold={items} onEdit={onEdit} onDelete={onDelete} />
            )}
        />
    );
}

export default OpptjeningUtlandListAndDialog;
