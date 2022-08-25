import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { date1YearAgo, date1YearFromNow, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import useEffectOnce from '../../hooks/useEffectOnce';
import getLenker from '../../lenker';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidssituasjonStepVeileder from './ArbeidssituasjonStepVeileder';
import ArbeidssituasjonArbeidsgivere from './shared/ArbeidssituasjonArbeidsgivere';
import ArbeidssituasjonFrilans from './shared/ArbeidssituasjonFrilans';
import ArbeidssituasjonSN from './shared/ArbeidssituasjonSN';
import { oppdaterSøknadMedArbeidsgivere } from './utils/arbeidsgivereUtils';
import { cleanupArbeidssituasjonStep } from './utils/cleanupArbeidssituasjonStep';
import { visVernepliktSpørsmål } from './utils/visVernepliktSpørsmål';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import UtenlandskNæringListAndDialog from '@navikt/sif-common-forms/lib/utenlandsk-næring/UtenlandskNæringListAndDialog';
import { Person } from '../../types';
import { getArbeidsgivereRemoteData } from '../../api/getArbeidsgiver';
import OpptjeningUtlandListAndDialog from '@navikt/sif-common-forms/lib/opptjening-utland/OpptjeningUtlandListAndDialog';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

interface Props {
    søker: Person;
    søknadsdato: Date;
    søknadsperiode?: DateRange;
}

const ArbeidssituasjonStep: React.FC<Props> = ({ søker, søknadsdato, søknadsperiode }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<SoknadFormData>();
    const {
        values,
        values: { ansatt_arbeidsforhold, harOpptjeningUtland, harUtenlandskNæring },
    } = formikProps;
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: false, isLoaded: false });

    const { isLoading, isLoaded } = loadState;

    useEffectOnce(() => {
        const fetchData = async () => {
            if (søker && søknadsperiode) {
                const arbeidsgivere = await getArbeidsgivereRemoteData(søknadsperiode.from, søknadsperiode.to);
                oppdaterSøknadMedArbeidsgivere(arbeidsgivere, formikProps);
                setLoadState({ isLoading: false, isLoaded: true });
            }
        };
        if (søknadsperiode && !isLoaded && !isLoading) {
            setLoadState({ isLoading: true, isLoaded: false });
            fetchData();
        }
    });

    return (
        <SoknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            buttonDisabled={isLoading}
            onStepCleanup={
                søknadsperiode
                    ? (values) => cleanupArbeidssituasjonStep(values, søknadsperiode, values.frilansoppdrag)
                    : undefined
            }>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && søknadsperiode && (
                <>
                    <Box padBottom="xl">
                        <ArbeidssituasjonStepVeileder />
                    </Box>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.tittel')}>
                        <ArbeidssituasjonArbeidsgivere
                            parentFieldName={SoknadFormField.ansatt_arbeidsforhold}
                            ansatt_arbeidsforhold={ansatt_arbeidsforhold}
                            søknadsperiode={søknadsperiode}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.frilanser.tittel')}>
                        <ArbeidssituasjonFrilans
                            parentFieldName={SoknadFormField.frilans}
                            frilansoppdrag={values.frilansoppdrag || []}
                            formValues={values.frilans}
                            søknadsperiode={søknadsperiode}
                            søknadsdato={søknadsdato}
                            urlSkatteetaten={getLenker(intl.locale).skatteetaten}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.sn.tittel')}>
                        <ArbeidssituasjonSN
                            formValues={values.selvstendig}
                            urlSkatteetatenSN={getLenker(intl.locale).skatteetatenSN}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.opptjeningUtland.tittel')}>
                        <SoknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.arbeidssituasjon.opptjeningUtland.spm')}
                            name={SoknadFormField.harOpptjeningUtland}
                            validate={getYesOrNoValidator()}
                        />
                        {harOpptjeningUtland === YesOrNo.YES && (
                            <FormBlock>
                                <OpptjeningUtlandListAndDialog
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    name={SoknadFormField.opptjeningUtland}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: 'Legg til jobb i et annet EØS-land',
                                        listTitle: 'Registrert jobb i et annet EØS-land',
                                        modalTitle: 'Jobbet i et annet EØS-land',
                                    }}
                                />
                            </FormBlock>
                        )}
                        <FormBlock>
                            <SoknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.arbeidssituasjon.utenlandskNæring.spm')}
                                name={SoknadFormField.harUtenlandskNæring}
                                validate={getYesOrNoValidator()}
                            />
                            {harUtenlandskNæring === YesOrNo.YES && (
                                <FormBlock>
                                    <UtenlandskNæringListAndDialog
                                        name={SoknadFormField.utenlandskNæring}
                                        validate={getListValidator({ required: true })}
                                        labels={{
                                            addLabel: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.utenlandskNæring.infoDialog.registrerKnapp'
                                            ),
                                            deleteLabel: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.utenlandskNæring.infoDialog.fjernKnapp'
                                            ),
                                            editLabel: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.utenlandskNæring.infoDialog.endreKnapp'
                                            ),
                                            infoTitle: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.utenlandskNæring.infoDialog.infoTittel'
                                            ),
                                            modalTitle: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.utenlandskNæring.infoDialog.modal.tittel'
                                            ),
                                        }}
                                    />
                                </FormBlock>
                            )}
                        </FormBlock>
                    </FormSection>
                    {visVernepliktSpørsmål(values) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.tittel')}>
                            <Box margin="l">
                                <SoknadFormComponents.YesOrNoQuestion
                                    name={SoknadFormField.harVærtEllerErVernepliktig}
                                    legend={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.spm')}
                                    validate={getYesOrNoValidator()}
                                    description={
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.info.tittel')}>
                                            <FormattedMessage id="steg.arbeidssituasjon.verneplikt.info.tekst" />
                                        </ExpandableInfo>
                                    }
                                />
                            </Box>
                        </FormSection>
                    )}
                </>
            )}
        </SoknadFormStep>
    );
};

export default ArbeidssituasjonStep;
