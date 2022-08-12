import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import MedlemskapStepFieldValidations from './medlemskapFieldValidations';
import { StepID } from '../soknadStepsConfig';
import SoknadFormStep from '../SoknadFormStep';
import dayjs from 'dayjs';

type Props = {
    søknadsdato: Date;
};

const MedlemsskapStep: React.FC<Props> = ({ søknadsdato }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    return (
        <SoknadFormStep id={StepID.MEDLEMSKAP}>
            <CounsellorPanel>
                <p>
                    <FormattedMessage id="step.medlemsskap.info.1" />
                    <Lenke href={getLenker().medlemskap} target="_blank">
                        <FormattedMessage id="step.medlemsskap.info.2" />
                    </Lenke>
                    .
                </p>
            </CounsellorPanel>
            <FormBlock margin="xxl">
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'step.medlemsskap.annetLandSiste12.spm')}
                    name={SoknadFormField.harBoddUtenforNorgeSiste12Mnd}
                    validate={MedlemskapStepFieldValidations.harBoddUtenforNorgeSiste12Mnd}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'step.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'step.medlemsskap.annetLandSiste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SoknadFormField>
                        name={SoknadFormField.utenlandsoppholdSiste12Mnd}
                        minDate={date1YearAgo}
                        maxDate={dayjs(søknadsdato).subtract(1, 'day').toDate()}
                        validate={MedlemskapStepFieldValidations.utenlandsoppholdSiste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.medlemsskap.annetLandSiste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'step.medlemsskap.annetLandNeste12.spm')}
                    name={SoknadFormField.skalBoUtenforNorgeNeste12Mnd}
                    validate={MedlemskapStepFieldValidations.skalBoUtenforNorgeNeste12Mnd}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'step.medlemsskap.hvaBetyrDette')}>
                            {intlHelper(intl, 'step.medlemsskap.annetLandNeste12.hjelp')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>
            {values.skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES && (
                <FormBlock margin="l">
                    <BostedUtlandListAndDialog<SoknadFormField>
                        minDate={dateToday}
                        maxDate={date1YearFromNow}
                        name={SoknadFormField.utenlandsoppholdNeste12Mnd}
                        validate={MedlemskapStepFieldValidations.utenlandsoppholdNeste12Mnd}
                        labels={{
                            addLabel: intlHelper(intl, 'step.medlemsskap.utenlandsopphold.leggTilLabel'),
                            modalTitle: intlHelper(intl, 'step.medlemsskap.annetLandNeste12.listeTittel'),
                        }}
                    />
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default MedlemsskapStep;
