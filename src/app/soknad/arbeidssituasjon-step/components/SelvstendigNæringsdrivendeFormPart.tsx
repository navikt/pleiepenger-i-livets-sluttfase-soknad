import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import { SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import SoknadFormComponents from '../../../soknad/SoknadFormComponents';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';

interface Props {
    formValues: SoknadFormData;
}

const SelvstendigNæringsdrivendeFormPart: React.FunctionComponent<Props> = ({ formValues: values }) => {
    const intl = useIntl();
    // const skipOrgNumValidation = getEnvironmentVariable('SKIP_ORGNUM_VALIDATION') === 'true';
    const { selvstendig_erSelvstendigNæringsdrivende, selvstendig_virksomhet, selvstendig_harFlereVirksomheter } =
        values;
    const erSelvstendigNæringsdrivende = selvstendig_erSelvstendigNæringsdrivende === YesOrNo.YES;
    const harFlereVirksomheter = erSelvstendigNæringsdrivende && selvstendig_harFlereVirksomheter === YesOrNo.YES;
    return (
        <>
            <SoknadFormComponents.YesOrNoQuestion
                name={SoknadFormField.selvstendig_erSelvstendigNæringsdrivende}
                legend={intlHelper(intl, 'step.arbeidssituasjon.selvstendig.erDuSelvstendigNæringsdrivende.spm')}
                validate={getYesOrNoValidator()}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'step.arbeidssituasjon.selvstendig.hjelpetekst.tittel')}>
                        <>
                            {intlHelper(intl, 'step.arbeidssituasjon.selvstendig.hjelpetekst')}{' '}
                            <Lenke href={getLenker(intl.locale).skatteetatenSN} target="_blank">
                                <FormattedMessage id="step.arbeidssituasjon.selvstendig.hjelpetekst.snSkatteetatenLenke" />
                            </Lenke>
                        </>
                    </ExpandableInfo>
                }
            />

            {erSelvstendigNæringsdrivende && (
                <FormBlock>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.selvstendig_harFlereVirksomheter}
                        legend={intlHelper(intl, 'step.arbeidssituasjon.selvstendig.harFlereVirksomheter.spm')}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}

            {harFlereVirksomheter && (
                <FormBlock>
                    <CounsellorPanel>
                        <FormattedMessage id="step.arbeidssituasjon.selvstendig.veileder.flereAktiveVirksomheter" />
                    </CounsellorPanel>
                </FormBlock>
            )}

            {erSelvstendigNæringsdrivende && values.selvstendig_harFlereVirksomheter !== YesOrNo.UNANSWERED && (
                <FormBlock>
                    <ResponsivePanel>
                        <VirksomhetInfoAndDialog
                            name={SoknadFormField.selvstendig_virksomhet}
                            harFlereVirksomheter={harFlereVirksomheter}
                            labels={{
                                infoTitle: selvstendig_virksomhet
                                    ? intlHelper(intl, 'step.arbeidssituasjon.selvstendig.infoDialog.infoTittel')
                                    : undefined,
                                editLabel: intlHelper(intl, 'step.arbeidssituasjon.selvstendig.infoDialog.endreKnapp'),
                                deleteLabel: intlHelper(
                                    intl,
                                    'step.arbeidssituasjon.selvstendig.infoDialog.fjernKnapp'
                                ),
                                addLabel: intlHelper(
                                    intl,
                                    'step.arbeidssituasjon.selvstendig.infoDialog.registrerKnapp'
                                ),
                                modalTitle: harFlereVirksomheter
                                    ? intlHelper(intl, 'step.arbeidssituasjon.selvstendig.infoDialog.tittel.flere')
                                    : intlHelper(intl, 'step.arbeidssituasjon.selvstendig.infoDialog.tittel.en'),
                            }}
                            // skipOrgNumValidation={skipOrgNumValidation}
                            validate={getRequiredFieldValidator()}
                            /*onAfterChange={() => {
                                SoknadTempStorage.update(values, StepID.ARBEIDSSITUASJON);
                            }}*/
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
