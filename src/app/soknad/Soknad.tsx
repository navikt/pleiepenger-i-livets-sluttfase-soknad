import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { StepID } from './soknadStepsConfig';
import { initialValues, SoknadFormData } from '../types/SoknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';

import SøknadContent from './SøknadContent';

const Soknad = () => (
    <SøknadEssentialsLoader
        contentLoadedRenderer={(
            formdata: Partial<SoknadFormData>,
            harMellomlagring,
            lastStepID: StepID | undefined
        ) => {
            return (
                <TypedFormikWrapper<SoknadFormData>
                    initialValues={formdata || initialValues}
                    onSubmit={() => {
                        null;
                    }}
                    renderForm={() => <SøknadContent lastStepID={lastStepID} harMellomlagring={harMellomlagring} />}
                />
            );
        }}
    />
);
export default Soknad;
