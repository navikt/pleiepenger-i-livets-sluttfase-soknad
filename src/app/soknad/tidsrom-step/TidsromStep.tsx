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
import { StepID } from '../soknadStepsConfig';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import SoknadFormStep from '../SoknadFormStep';
import {
    validateFerieuttakIPerioden,
    validateFradato,
    validateTildato,
    validateUtenlandsoppholdIPerioden,
} from '../../validation/fieldValidation';
import UtenlandsoppholdListAndDialog from '@navikt/sif-common-forms/lib/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { Ferieuttak, Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FerieuttakListAndDialog from '@navikt/sif-common-forms/lib/ferieuttak/FerieuttakListAndDialog';

dayjs.extend(minMax);

const TidsromStep = () => {
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
            showSubmitButton={!søkerKunHelgedager(values.periodeFra, values.periodeTil)}>
            <CounsellorPanel kompakt={true} type="normal">
                <p>
                    <FormattedMessage id="step.tidsrom.counsellorPanel.avsnit.1" />
                </p>
                <p>
                    <FormattedMessage id="step.tidsrom.counsellorPanel.avsnit.2" />
                </p>
                <p>
                    <FormattedMessage id="step.tidsrom.counsellorPanel.avsnit.3" />
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
                        validate: validateTilDatoField,
                        name: SoknadFormField.periodeTil,
                        dayPickerProps: { initialMonth: periodeFra ? new Date(periodeFra) : undefined },
                    }}
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
                                legend={intlHelper(intl, 'steg.tidsrom.pleierDuDenSykeHjemme.spm')}
                                name={SoknadFormField.pleierDuDenSykeHjemme}
                                validate={getYesOrNoValidator()}
                                description={
                                    <ExpandableInfo
                                        title={intlHelper(intl, 'steg.tidsrom.pleierDuDenSykeHjemme.info.tittel')}>
                                        <FormattedMessage id={'steg.tidsrom.pleierDuDenSykeHjemme.info'} />
                                    </ExpandableInfo>
                                }
                            />
                        </Box>
                        <Box margin="l">
                            {values.pleierDuDenSykeHjemme === YesOrNo.NO && (
                                <Alertstripe type="advarsel">
                                    <FormattedMessage id="steg.tidsrom.pleierDuDenSykeHjemme.alert" />
                                </Alertstripe>
                            )}
                        </Box>
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
                        <Box margin="xl">
                            <SoknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                                name={SoknadFormField.skalTaUtFerieIPerioden}
                                validate={getYesOrNoValidator()}
                            />
                        </Box>
                        {values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                            <Box margin="m" padBottom="l">
                                <FerieuttakListAndDialog<SoknadFormField>
                                    name={SoknadFormField.ferieuttakIPerioden}
                                    minDate={periode.from}
                                    maxDate={periode.to}
                                    labels={{
                                        modalTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.modalTitle'),
                                        listTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.listTitle'),
                                        addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel'),
                                    }}
                                    validate={
                                        periode
                                            ? (ferie: Ferieuttak[]) => validateFerieuttakIPerioden(periode, ferie)
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
