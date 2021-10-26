import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';
import SoknadFormComponents from '../../SoknadFormComponents';

interface Props {
    formValues: SoknadFormData;
}

const FrilansFormPart: React.FunctionComponent<Props> = ({
    formValues: { frilans_erFrilanser, frilans_jobberFortsattSomFrilans, frilans_startdato },
}) => {
    const erFrilanser = frilans_erFrilanser === YesOrNo.YES;
    const harSluttetSomFrilanser = frilans_jobberFortsattSomFrilans === YesOrNo.NO;
    const intl = useIntl();
    return (
        <>
            <SoknadFormComponents.YesOrNoQuestion
                name={SoknadFormField.frilans_erFrilanser}
                legend={intlHelper(intl, 'step.arbeidssituasjon.frilanser.erFrilanser.spm')}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'step.arbeidssituasjon.frilanser.hjelpetekst.tittel')}>
                        <>tekst</>
                    </ExpandableInfo>
                }
                validate={getYesOrNoValidator()}
            />
            {erFrilanser && (
                <FormBlock margin="l">
                    <ResponsivePanel className={'responsivePanel'}>
                        <FormBlock margin="none">
                            <SoknadFormComponents.DatePicker
                                name={SoknadFormField.frilans_startdato}
                                label={intlHelper(intl, 'step.arbeidssituasjon.frilanser.nårStartet.spm')}
                                showYearSelector={true}
                                maxDate={dateToday}
                                validate={getDateValidator({
                                    required: true,
                                    max: dateToday,
                                })}
                            />
                        </FormBlock>
                        <FormBlock>
                            <SoknadFormComponents.YesOrNoQuestion
                                name={SoknadFormField.frilans_jobberFortsattSomFrilans}
                                legend={intlHelper(intl, 'step.arbeidssituasjon.frilanser.jobberFortsatt.spm')}
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                        {harSluttetSomFrilanser && (
                            <FormBlock>
                                <SoknadFormComponents.DatePicker
                                    name={SoknadFormField.frilans_sluttdato}
                                    label={intlHelper(intl, 'step.arbeidssituasjon.frilanser.nårSluttet.spm')}
                                    showYearSelector={true}
                                    minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                    maxDate={dateToday}
                                    validate={getDateValidator({
                                        required: true,
                                        min: datepickerUtils.getDateFromDateString(frilans_startdato),
                                        max: dateToday,
                                    })}
                                />
                            </FormBlock>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default FrilansFormPart;
