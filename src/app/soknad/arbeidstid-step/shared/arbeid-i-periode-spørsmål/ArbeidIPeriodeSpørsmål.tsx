import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    ArbeidIPeriodeIntlValues,
    getArbeidstidFastProsentValidator,
    getArbeidstimerFastDagValidator,
    TidFasteUkedagerInput,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger';
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode-dialog/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { getWeeksInDateRange } from '@navikt/sif-common-utils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeField } from '../../../../types/ArbeidIPeriode';
import { Arbeidsforhold, ArbeidsforholdFrilanser } from '../../../../types/Arbeidsforhold';
import SoknadFormComponents from '../../../SoknadFormComponents';
import ArbeidstidVariert from '../arbeidstid-variert/ArbeidstidVariert';
import { ArbeidstidRegistrertLogProps } from '../types';
import { getArbeidErLiktHverUkeValidator } from '../validation/arbeidErLiktHverUkeValidator';
import { getArbeidstidTimerEllerProsentValidator } from '../validation/arbeidstidEllerProsentValidator';
import { getJobberIPeriodenValidator } from '../validation/jobberIPeriodenSpørsmål';
import InfoSøkerKunHelgedager from './InfoSøkerKunHelgedager';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

const BRUK_KUN_KORT_PERIODE = true;

interface Props extends ArbeidstidRegistrertLogProps {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
    søkerKunHelgedager: boolean;
    onArbeidstidVariertChange: () => void;
}

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    periode,
    arbeidsstedNavn,
    søkerKunHelgedager,
    onArbeidstidVariertChange,
    onArbeidPeriodeRegistrert,
    onArbeidstidEnkeltdagRegistrert,
}: Props) => {
    const intl = useIntl();
    const [arbeidstidChanged, setArbeidstidChanged] = useState(false);

    useEffect(() => {
        if (arbeidstidChanged === true) {
            setArbeidstidChanged(false);
            onArbeidstidVariertChange();
        }
    }, [arbeidstidChanged, onArbeidstidVariertChange]);

    const { jobberNormaltTimer } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        return <AlertStripeFeil>Det mangler informasjon om hvor mye du jobber normalt</AlertStripeFeil>;
    }

    const intlValues = getArbeidstidIPeriodeIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            jobberNormaltTimer,
            type: arbeidsforholdType,
        },
        periode,
    });

    const getFieldName = (field: ArbeidIPeriodeField) => `${parentFieldName}.arbeidIPeriode.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { jobberIPerioden, timerEllerProsent, erLiktHverUke } = arbeidIPeriode || {};
    const erKortPeriode = getWeeksInDateRange(periode).length < (BRUK_KUN_KORT_PERIODE ? 100 : 4);

    const renderArbeidstidVariertPart = (kanLeggeTilPeriode: boolean) => (
        <ArbeidstidVariert
            arbeidstid={arbeidsforhold.arbeidIPeriode?.enkeltdager}
            kanLeggeTilPeriode={kanLeggeTilPeriode}
            jobberNormaltTimer={jobberNormaltTimerNumber}
            periode={periode}
            intlValues={intlValues}
            arbeidsstedNavn={arbeidsstedNavn}
            arbeidsforholdType={arbeidsforholdType}
            formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
            onArbeidstidVariertChanged={() => setArbeidstidChanged(true)}
            onArbeidPeriodeRegistrert={onArbeidPeriodeRegistrert}
            onArbeidstidEnkeltdagRegistrert={onArbeidstidEnkeltdagRegistrert}
        />
    );

    return (
        <>
            <SoknadFormComponents.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={intlHelper(intl, `arbeidIPeriode.jobberIPerioden.spm`, intlValues)}
                useTwoColumns={false}
                validate={getJobberIPeriodenValidator(intlValues)}
                radios={getJobberIPeriodenRadios(intl)}
            />

            {jobberIPerioden === JobberIPeriodeSvar.redusert && erKortPeriode === true && (
                <FormBlock>
                    <ResponsivePanel>{renderArbeidstidVariertPart(false)}</ResponsivePanel>
                </FormBlock>
            )}

            {jobberIPerioden === JobberIPeriodeSvar.redusert && erKortPeriode === false && (
                <>
                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
                            legend={intlHelper(intl, `arbeidIPeriode.erLiktHverUke.spm`, intlValues)}
                            validate={getArbeidErLiktHverUkeValidator(intlValues)}
                            useTwoColumns={true}
                            labels={{
                                yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                            }}
                            description={
                                <ExpandableInfo title={intlHelper(intl, 'arbeidIPeriode.erLiktHverUke.spm.hvaBetyr')}>
                                    <FormattedMessage id={'arbeidIPeriode.erLiktHverUke.spm.hvaBetyr.1'} />
                                    <br />
                                    <p>
                                        <FormattedMessage id={'arbeidIPeriode.erLiktHverUke.spm.hvaBetyr.2'} />
                                    </p>
                                </ExpandableInfo>
                            }
                        />
                    </FormBlock>

                    {erLiktHverUke === YesOrNo.NO && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                {renderArbeidstidVariertPart(true)}
                                {søkerKunHelgedager && (
                                    <Box margin="xl">
                                        <InfoSøkerKunHelgedager />
                                    </Box>
                                )}
                            </ResponsivePanel>
                        </FormBlock>
                    )}

                    {erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <SoknadFormComponents.RadioPanelGroup
                                name={getFieldName(ArbeidIPeriodeField.timerEllerProsent)}
                                legend={intlHelper(intl, `arbeidIPeriode.timerEllerProsent.spm`, intlValues)}
                                radios={getTimerEllerProsentRadios(intl, intlValues)}
                                validate={getArbeidstidTimerEllerProsentValidator(intlValues)}
                                useTwoColumns={true}
                            />
                            {timerEllerProsent === TimerEllerProsent.PROSENT && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SoknadFormComponents.NumberInput
                                            name={getFieldName(ArbeidIPeriodeField.jobberProsent)}
                                            bredde="XS"
                                            maxLength={4}
                                            label={intlHelper(intl, 'arbeidIPeriode.jobberProsent.spm', intlValues)}
                                            validate={(value) => {
                                                const error = getArbeidstidFastProsentValidator({ max: 100, min: 1 })(
                                                    value
                                                );
                                                return error
                                                    ? {
                                                          key: `validation.arbeidIPeriode.fast.prosent.${error.key}`,
                                                          values: { ...intlValues, min: 1, max: 100 },
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            // suffix={getRedusertArbeidstidPerUkeInfo(
                                            //     intl,
                                            //    jobberNormaltTimer,
                                            //    jobberProsent
                                            //  )}
                                            suffixStyle="text"
                                        />
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {timerEllerProsent === TimerEllerProsent.TIMER && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SoknadFormComponents.InputGroup
                                            legend={intlHelper(intl, 'arbeidIPeriode.ukedager.tittel', intlValues)}
                                            validate={() => {
                                                const error = validateFasteArbeidstimerIUke(arbeidIPeriode?.fasteDager);
                                                return error
                                                    ? {
                                                          key: `validation.arbeidIPeriode.timer.${error.key}`,
                                                          values: intlValues,
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            name={'fasteDager.gruppe' as any}>
                                            <TidFasteUkedagerInput
                                                name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                                validateDag={(dag, value) => {
                                                    const error = getArbeidstimerFastDagValidator()(value);
                                                    return error
                                                        ? {
                                                              key: `validation.arbeidIPeriode.fast.tid.${error}`,
                                                              keepKeyUnaltered: true,
                                                              values: { ...intlValues, dag },
                                                          }
                                                        : undefined;
                                                }}
                                            />
                                        </SoknadFormComponents.InputGroup>
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                        </FormBlock>
                    )}
                </>
            )}
        </>
    );
};

const getJobberIPeriodenRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.jobberIkke'),
        value: JobberIPeriodeSvar.heltFravær,
    },
    {
        label: intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.jobberRedusert'),
        value: JobberIPeriodeSvar.redusert,
    },
    {
        label: intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.jobberVanlig'),
        value: JobberIPeriodeSvar.somVanlig,
    },
];

const getTimerEllerProsentRadios = (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues) => [
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.prosent`, intlValues),
        value: TimerEllerProsent.PROSENT,
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
    },
];

export default ArbeidIPeriodeSpørsmål;
