import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import IntroForm from './IntroForm';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude/lib';

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    useLogSidevisning(SIFCommonPageKey.intro);

    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedMessage id="introform.informationPoster.avsnitt.1" />

                    <p>
                        <FormattedHtmlMessage id="introform.informationPoster.avsnitt.2.html" />{' '}
                    </p>
                    <p>
                        <FormattedHtmlMessage id="introform.informationPoster.avsnitt.3" />
                    </p>
                    <p>
                        <FormattedHtmlMessage id="introform.informationPoster.avsnitt.4" />
                    </p>
                    <p>
                        <FormattedHtmlMessage id="introform.informationPoster.avsnitt.5" />{' '}
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock>
                <IntroForm
                    onValidSubmit={() => {
                        setTimeout(() => {
                            navigateToSoknadFrontpage(history);
                        });
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
