import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday, date3YearsAgo } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { fraværPeriodeToDateRange } from '@navikt/sif-common-forms/lib/fravær';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { StepID } from '../soknadStepsConfig';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { getPeriodeBoundaries } from '../../utils/periodeUtils';
import FraværStepInfo from './FraværStepInfo';
import fraværStepUtils from './fraværStepUtils';
import { getFraværPerioderValidator } from './fraværFieldValidations';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import SoknadFormStep from '../SoknadFormStep';
import SoknadFormComponents from '../SoknadFormComponents';
import FraværPerioderListAndDialog from '@navikt/sif-common-forms/lib/fravær/FraværPerioderListAndDialog';

type Props = {
    values: SoknadFormData;
};

const FraværStep = ({ values }: Props) => {
    const { harPerioderMedFravær, perioder_harVærtIUtlandet, fraværPerioder } = values;
    const intl = useIntl();

    const førsteOgSisteDagMedFravær = getPeriodeBoundaries(fraværPerioder);

    const kanIkkeFortsette = harPerioderMedFravær === YesOrNo.NO;

    return (
        <SoknadFormStep
            id={StepID.FRAVÆR}
            showSubmitButton={kanIkkeFortsette === false}
            onStepCleanup={fraværStepUtils.cleanupFraværStep}>
            <FormBlock>
                <FraværStepInfo.IntroVeileder />
            </FormBlock>

            <FormBlock>
                <FormSection title={intlHelper(intl, 'step.fravaer.dager.tittel')}>
                    <p>
                        <FormattedMessage id="step.fravaer.dager.info" />
                    </p>

                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.harPerioderMedFravær}
                            legend={intlHelper(intl, 'step.fravaer.spm.harPerioderMedFravær')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>

                    {/* DAGER MED FULLT FRAVÆR*/}
                    {harPerioderMedFravær === YesOrNo.YES && (
                        <FormBlock>
                            <FraværPerioderListAndDialog<SoknadFormField>
                                name={SoknadFormField.fraværPerioder}
                                periodeDescription={<FraværStepInfo.Tidsbegrensning />}
                                minDate={date3YearsAgo}
                                maxDate={dateToday}
                                begrensTilSammeÅr={false}
                                validate={getFraværPerioderValidator()}
                                labels={{
                                    listTitle: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.listTitle'),
                                    addLabel: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.addLabel'),
                                    modalTitle: intlHelper(intl, 'step.fravaer.harPerioderMedFravær.modalTitle'),
                                }}
                                dateRangesToDisable={[...values.fraværPerioder.map(fraværPeriodeToDateRange)]}
                                helgedagerIkkeTillat={true}
                                ikkeBrukHjemmePgaKorona={true}
                            />
                        </FormBlock>
                    )}

                    {kanIkkeFortsette && (
                        <FormBlock>
                            <AlertStripeAdvarsel>
                                <FormattedMessage id="step.fravaer.måVelgeSituasjon" />
                            </AlertStripeAdvarsel>
                        </FormBlock>
                    )}
                </FormSection>

                {kanIkkeFortsette === false && (
                    <FormSection title={intlHelper(intl, 'step.fravaer.utenlandsopphold.tittel')}>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.perioder_harVærtIUtlandet}
                            legend={intlHelper(
                                intl,
                                'step.fravaer.har_du_oppholdt_deg_i_utlandet_for_dager_du_soker_ok.spm'
                            )}
                            validate={getYesOrNoValidator()}
                        />

                        {perioder_harVærtIUtlandet === YesOrNo.YES && (
                            <FormBlock>
                                <BostedUtlandListAndDialog<SoknadFormField>
                                    name={SoknadFormField.perioder_utenlandsopphold}
                                    minDate={førsteOgSisteDagMedFravær.min || date3YearsAgo}
                                    maxDate={førsteOgSisteDagMedFravær.max || dateToday}
                                    labels={{
                                        addLabel: intlHelper(intl, 'step.fravaer.utenlandsopphold.addLabel'),
                                        modalTitle: intlHelper(intl, 'step.fravaer.utenlandsopphold.modalTitle'),
                                    }}
                                    validate={getListValidator({ required: true })}
                                />
                            </FormBlock>
                        )}
                    </FormSection>
                )}
            </FormBlock>
        </SoknadFormStep>
    );
};

export default FraværStep;
