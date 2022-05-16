import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { useFormikContext } from 'formik';
import Alertstripe from 'nav-frontend-alertstriper';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import { StepConfigProps, StepID } from '../soknadStepsConfig';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import SoknadFormStep from '../SoknadFormStep';
import { validateFradato, validateTildato, validateUtenlandsoppholdIPerioden } from '../../validation/fieldValidation';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common-forms/lib/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { yesterday } from '../../utils/dates';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';

dayjs.extend(minMax);

const TidsromStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);
    const periode: DateRange = {
        from: periodeFra || date1YearAgo,
        to: periodeTil || date1YearFromNow,
    };

    const validateFraDatoField = (date?: string) => {
        return validateFradato(date, values.periodeTil);
    };

    const validateTilDatoField = (date?: string) => {
        return validateTildato(date, values.periodeFra);
    };

    return (
        <SoknadFormStep
            id={StepID.TIDSROM}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={!søkerKunHelgedager(values.periodeFra, values.periodeTil)}>
            <CounsellorPanel kompakt={true} type="normal">
                <p>
                    <FormattedMessage id="step.tidsrom.counsellorPanel.avsnit.1" />
                </p>

                <p>
                    <FormattedMessage id="step.tidsrom.counsellorPanel.avsnit.2" />
                </p>
            </CounsellorPanel>
            <FormBlock>
                <SoknadFormComponents.DateRangePicker
                    legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.tidsrom.hjelpetekst.tittel')}>
                            <p>
                                <FormattedMessage id="steg.tidsrom.hjelpetekst.1" />
                            </p>
                            <p>
                                <FormattedMessage id="steg.tidsrom.hjelpetekst.2" />
                            </p>
                            <p>
                                <FormattedMessage id="steg.tidsrom.hjelpetekst.3" />
                            </p>
                            <p>
                                <FormattedMessage id="steg.tidsrom.hjelpetekst.4" />
                            </p>
                        </ExpandableInfo>
                    }
                    fromInputProps={{
                        label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                        validate: validateFraDatoField,
                        name: SoknadFormField.periodeFra,
                    }}
                    toInputProps={{
                        label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                        // TODO: Validering max to date i går
                        validate: validateTilDatoField,
                        name: SoknadFormField.periodeTil,
                        dayPickerProps: { initialMonth: periodeFra ? new Date(periodeFra) : undefined },
                    }}
                    maxDate={yesterday}
                    disableWeekend={false}
                />
                {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                    <Box padBottom="xl">
                        <Alertstripe type="advarsel">
                            <FormattedMessage id="step.tidsrom.søkerKunHelgedager.alert" />
                        </Alertstripe>
                    </Box>
                )}

                {!søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                    <>
                        <Box margin="xl">
                            <SoknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                                name={SoknadFormField.skalOppholdeSegIUtlandetIPerioden}
                                validate={getYesOrNoValidator()}
                            />
                        </Box>
                        {values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                            <Box margin="m">
                                <UtenlandsoppholdListAndDialog<SoknadFormField>
                                    name={SoknadFormField.utenlandsoppholdIPerioden}
                                    minDate={periode.from}
                                    maxDate={periode.to}
                                    excludeInnlagtQuestion={true}
                                    labels={{
                                        modalTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.modalTitle'),
                                        listTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.listTitle'),
                                        addLabel: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.addLabel'),
                                    }}
                                    validate={
                                        periode
                                            ? (opphold: Utenlandsopphold[]) =>
                                                  validateUtenlandsoppholdIPerioden(periode, opphold)
                                            : undefined
                                    }
                                />
                            </Box>
                        )}
                    </>
                )}
            </FormBlock>
        </SoknadFormStep>
    );
};

export default TidsromStep;
