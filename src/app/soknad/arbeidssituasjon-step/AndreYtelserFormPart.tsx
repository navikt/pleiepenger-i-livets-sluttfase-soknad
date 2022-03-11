import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { AndreYtelserFraNAV } from '../../types';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';

interface Props {
    formValues: SoknadFormData;
}

const AndreYtelserFormPart = ({ formValues: { mottarAndreYtelser } }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.mottarAndreYtelser}
                    legend={intlHelper(intl, 'steg.arbeidssituasjon.andreYtelser.spm')}
                    validate={getYesOrNoValidator()}
                />
            </Box>
            {mottarAndreYtelser === YesOrNo.YES && (
                <Box margin="l">
                    <ResponsivePanel>
                        <SoknadFormComponents.CheckboxPanelGroup
                            name={SoknadFormField.andreYtelser}
                            legend={intlHelper(intl, 'steg.arbeidssituasjon.andreYtelser.hvilke.spm')}
                            checkboxes={Object.keys(AndreYtelserFraNAV).map((ytelse) => ({
                                label: intlHelper(intl, `NAV_YTELSE.${ytelse}`),
                                value: ytelse,
                            }))}
                            validate={getListValidator({ required: true })}
                        />
                    </ResponsivePanel>
                </Box>
            )}
        </>
    );
};

export default AndreYtelserFormPart;
