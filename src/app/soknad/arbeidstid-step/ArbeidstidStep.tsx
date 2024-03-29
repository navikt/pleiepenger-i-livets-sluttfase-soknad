import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { useFormikContext } from 'formik';
import { FrilansFormField } from '../../types/FrilansFormData';
import { SelvstendigFormField } from '../../types/SelvstendigFormData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './shared/arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
import { cleanupArbeidstidStep } from './utils/cleanupArbeidstidStep';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import SoknadTempStorage from '../SoknadTempStorage';
import { Person } from '../../types';
import { harFraværIPerioden } from './utils/arbeidstidUtils';
import { ConfirmationDialog } from '../../types/ConfirmationDialog';
import BekreftDialog from '@navikt/sif-common-core/lib/components/dialogs/bekreft-dialog/BekreftDialog';
import { getIngenFraværConfirmationDialog } from '../confirmation-dialogs/ingenFraværConfirmation';
interface Props {
    søker: Person;
    periode?: DateRange;
    soknadId?: string;
}

const ArbeidstidStep: React.FC<Props> = ({ søker, periode, soknadId }: Props) => {
    const intl = useIntl();
    const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog | undefined>(undefined);
    const { logArbeidPeriodeRegistrert, logArbeidEnkeltdagRegistrert, logBekreftIngenFraværFraJobb } =
        useLogSøknadInfo();

    const formikProps = useFormikContext<SoknadFormData>();
    const {
        values: { ansatt_arbeidsforhold, frilans, selvstendig },
    } = formikProps;

    const periodeSomFrilanserISøknadsperiode =
        frilans.arbeidsforhold && periode ? getPeriodeSomFrilanserInnenforPeriode(periode, frilans) : undefined;

    const periodeSomSelvstendigISøknadsperiode =
        selvstendig.harHattInntektSomSN === YesOrNo.YES && selvstendig.virksomhet !== undefined && periode
            ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig.virksomhet)
            : undefined;

    const handleArbeidstidChanged = () => {
        if (soknadId !== undefined) {
            SoknadTempStorage.update(soknadId, formikProps.values, StepID.ARBEIDSTID, { søker });
        }
    };

    if (periode === undefined) {
        return <div>Periode mangler</div>;
    }

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onStepCleanup={(values) => cleanupArbeidstidStep(values, periode)}
            onBeforeValidSubmit={() => {
                return new Promise((resolve) => {
                    if (harFraværIPerioden(ansatt_arbeidsforhold, frilans, selvstendig) === false) {
                        setTimeout(() => {
                            setConfirmationDialog(
                                getIngenFraværConfirmationDialog({
                                    onCancel: () => {
                                        logBekreftIngenFraværFraJobb(false);
                                        setConfirmationDialog(undefined);
                                    },
                                    onConfirm: () => {
                                        logBekreftIngenFraværFraJobb(true);
                                        setConfirmationDialog(undefined);
                                        resolve(true);
                                    },
                                })
                            );
                        });
                    } else {
                        resolve(true);
                    }
                });
            }}>
            {confirmationDialog && (
                <BekreftDialog
                    isOpen={true}
                    bekreftLabel={confirmationDialog.okLabel}
                    avbrytLabel={confirmationDialog.cancelLabel}
                    onBekreft={confirmationDialog.onConfirm}
                    onAvbryt={confirmationDialog.onCancel}
                    onRequestClose={confirmationDialog.onCancel}
                    contentLabel={confirmationDialog.title}>
                    {confirmationDialog.content}
                </BekreftDialog>
            )}
            <Box padBottom="m">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage
                            id={'arbeidIPeriode.StepInfo.1'}
                            values={
                                periode
                                    ? {
                                          fra: prettifyDateFull(periode.from),
                                          til: prettifyDateFull(periode.to),
                                      }
                                    : undefined
                            }
                        />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidIPeriode.StepInfo.2'} />
                    </p>
                </CounsellorPanel>
            </Box>

            {periode && (
                <FormBlock>
                    {ansatt_arbeidsforhold.map((arbeidsforhold, index) => {
                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (erAnsattHosArbeidsgiverISøknadsperiode(arbeidsforhold) === false) {
                            return null;
                        }
                        return (
                            <FormSection title={arbeidsforhold.arbeidsgiver.navn} key={arbeidsforhold.arbeidsgiver.id}>
                                <ArbeidIPeriodeSpørsmål
                                    arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    arbeidsforhold={arbeidsforhold}
                                    periode={periode}
                                    parentFieldName={`${SoknadFormField.ansatt_arbeidsforhold}.${index}`}
                                    søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                                    onArbeidstidVariertChange={handleArbeidstidChanged}
                                    onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                    onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                                />
                            </FormSection>
                        );
                    })}
                </FormBlock>
            )}

            {frilans.arbeidsforhold && periode && periodeSomFrilanserISøknadsperiode && (
                <FormBlock>
                    <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                        <ArbeidIPeriodeSpørsmål
                            arbeidsstedNavn="Frilansoppdrag"
                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                            arbeidsforhold={frilans.arbeidsforhold}
                            periode={periodeSomFrilanserISøknadsperiode}
                            parentFieldName={FrilansFormField.arbeidsforhold}
                            søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                            onArbeidstidVariertChange={handleArbeidstidChanged}
                            onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                            onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                        />
                    </FormSection>
                </FormBlock>
            )}

            {selvstendig.harHattInntektSomSN === YesOrNo.YES &&
                periode &&
                selvstendig.arbeidsforhold &&
                periodeSomSelvstendigISøknadsperiode && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                arbeidsstedNavn="Selvstendig næringsdrivende"
                                arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                arbeidsforhold={selvstendig.arbeidsforhold}
                                periode={periodeSomSelvstendigISøknadsperiode}
                                parentFieldName={SelvstendigFormField.arbeidsforhold}
                                søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                                onArbeidstidVariertChange={handleArbeidstidChanged}
                                onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                            />
                        </FormSection>
                    </FormBlock>
                )}
        </SøknadFormStep>
    );
};

export default ArbeidstidStep;
