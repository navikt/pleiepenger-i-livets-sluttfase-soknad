import * as React from 'react';
import Box from '@navikt/sif-common-core/lib//components/box/Box';
import { useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib//utils/bemUtils';
import './arbeidsforholdSummary.less';
import JaNeiSvar from './JaNeiSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { ArbeidsforholdFormData } from '../../../types/ArbeidsforholdTypes';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';

const bem = bemUtils('arbeidsforholdSummary');
interface Props {
    arbeidsforhold: ArbeidsforholdFormData[];
}

const ArbeidsforholdSummaryView: React.FC<Props> = ({ arbeidsforhold }: Props): React.ReactElement => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.header')}>
            <Box margin="l">
                {arbeidsforhold.map((arbeidsforhold: ArbeidsforholdFormData, index: number) => {
                    const orgInfo = {
                        navn: arbeidsforhold.navn,
                        organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
                    };

                    return (
                        <Box key={index} padBottom={'l'}>
                            {/* Title */}
                            <div className={bem.element('org')}>
                                {orgInfo.navn}{' '}
                                {orgInfo.organisasjonsnummer && (
                                    <>(organisasjonsnummer: {orgInfo.organisasjonsnummer})</>
                                )}
                            </div>
                            {/* Content */}
                            <div className={'arbeidsforholdSummaryContent'}>
                                <Box margin={'s'}>
                                    <SummaryBlock
                                        header={intlHelper(intl, 'step.oppsummering.arbeidsforhold.harHattFravær.spm', {
                                            organisasjonsnavn: orgInfo.navn,
                                        })}>
                                        <JaNeiSvar
                                            harSvartJa={arbeidsforhold.harHattFraværHosArbeidsgiver === YesOrNo.YES}
                                        />
                                    </SummaryBlock>
                                </Box>
                            </div>
                        </Box>
                    );
                })}
            </Box>
        </SummarySection>
    );
};

export default ArbeidsforholdSummaryView;
