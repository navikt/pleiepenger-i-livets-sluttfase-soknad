import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, FormikInputGroup } from '@navikt/sif-common-formik/lib';
import {
    ArbeidIPeriodeIntlValues,
    ArbeidsforholdType,
    ArbeidstidKalender,
    SøknadsperioderMånedListe,
    TidEnkeltdagEndring,
} from '@navikt/sif-common-pleiepenger';
// import ArbeidstidMånedInfo from '@navikt/sif-common-pleiepenger/lib/arbeidstid-måned-info/ArbeidstidMånedInfo';
// import SøknadsperioderMånedListe from '@navikt/sif-common-pleiepenger/lib/søknadsperioder-måned-liste/SøknadsperioderMånedListe';
// import { TidEnkeltdagEndring } from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/TidEnkeltdagForm';
// import { ArbeidstidKalender } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-kalender/components';
import { DateDurationMap, getDatesInMonthOutsideDateRange, getMonthsInDateRange } from '@navikt/sif-common-utils';
import { useFormikContext } from 'formik';
import { Element } from 'nav-frontend-typografi';
import { SoknadFormData, SoknadFormField } from '../../../../types/SoknadFormData';
// import ArbeidstidPeriode from '../arbeidstid-periode/ArbeidstidPeriode';
import { ArbeidstidRegistrertLogProps } from '../types';
import { validateArbeidsTidEnkeltdager } from '../validation/validateArbeidsTidEnkeltdager';
import ArbeidstidPeriode from '../arbeidstid-periode/ArbeidstidPeriode';

interface Props extends ArbeidstidRegistrertLogProps {
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    formFieldName: SoknadFormField;
    periode: DateRange;
    jobberNormaltTimer: number;
    arbeidstid?: DateDurationMap;
    intlValues: ArbeidIPeriodeIntlValues;
    kanLeggeTilPeriode: boolean;
    onArbeidstidVariertChanged?: (arbeidstid: DateDurationMap) => void;
}

const ArbeidstidVariert: React.FunctionComponent<Props> = ({
    formFieldName,
    arbeidstid = {},
    arbeidsstedNavn,
    arbeidsforholdType,
    jobberNormaltTimer,
    periode,
    intlValues,
    kanLeggeTilPeriode,
    onArbeidstidVariertChanged,
    onArbeidstidEnkeltdagRegistrert,
    onArbeidPeriodeRegistrert,
}) => {
    const intl = useIntl();
    const { setFieldValue } = useFormikContext<SoknadFormData>() || {};

    const antallMåneder = getMonthsInDateRange(periode).length;

    const handleOnEnkeltdagChange = (evt: TidEnkeltdagEndring) => {
        const newValues = { ...arbeidstid, ...evt.dagerMedTid };
        setFieldValue(formFieldName as any, newValues);
        if (onArbeidstidEnkeltdagRegistrert) {
            onArbeidstidEnkeltdagRegistrert({ antallDager: Object.keys(evt.dagerMedTid).length });
        }
        onArbeidstidVariertChanged ? onArbeidstidVariertChanged(newValues) : undefined;
    };

    const handleOnPeriodeChange = (tid: DateDurationMap) => {
        if (onArbeidPeriodeRegistrert) {
            onArbeidPeriodeRegistrert({
                verdi: 'ukeplan',
            });
        }
        const dagerMedArbeid = { ...arbeidstid, ...tid };
        setFieldValue(formFieldName, dagerMedArbeid);
        if (onArbeidstidVariertChanged) {
            onArbeidstidVariertChanged(dagerMedArbeid);
        }
    };

    const månedContentRenderer = (måned: DateRange) => {
        return (
            <ArbeidstidKalender
                arbeidsstedNavn={arbeidsstedNavn}
                arbeidsforholdType={arbeidsforholdType}
                måned={måned}
                åpentEkspanderbartPanel={antallMåneder === 1 || kanLeggeTilPeriode === false}
                tidArbeidstid={arbeidstid}
                utilgjengeligeDatoer={getDatesInMonthOutsideDateRange(måned.from, periode)}
                periode={periode}
                onEnkeltdagChange={handleOnEnkeltdagChange}
            />
        );
    };

    return (
        <FormikInputGroup
            name={`${formFieldName}_dager`}
            validate={() => validateArbeidsTidEnkeltdager(arbeidstid, periode, intlValues)}
            tag="div">
            {kanLeggeTilPeriode ? (
                <>
                    <Element tag="h3">
                        <FormattedMessage id="arbeidstidVariert.periode.tittel" />
                    </Element>
                    <ul>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.1" />
                        </li>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.2" />
                        </li>
                        <li>
                            <FormattedMessage id="arbeidstidVariert.periode.info.3" />
                        </li>
                    </ul>
                    <Box margin="l">
                        <ArbeidstidPeriode
                            onPeriodeChange={handleOnPeriodeChange}
                            registrerKnappLabel={intlHelper(intl, 'arbeidstidVariert.registrerJobbKnapp.label')}
                            formProps={{
                                jobberNormaltTimer,
                                intlValues,
                                periode,
                                arbeidsstedNavn,
                            }}
                        />
                    </Box>
                    <FormBlock>
                        <Element tag="h3">
                            <FormattedMessage id="arbeidstidVariert.månedsliste.tittel" />
                        </Element>
                        <Box margin="l">
                            <SøknadsperioderMånedListe
                                periode={periode}
                                årstallHeadingLevel={3}
                                månedContentRenderer={månedContentRenderer}
                            />
                        </Box>
                    </FormBlock>
                </>
            ) : (
                <>
                    <Element tag="h3">
                        <FormattedMessage id={'arbeidstidVariert.kortPeriode.tittel'} />
                    </Element>
                    <p>
                        <FormattedMessage id="arbeidstidVariert.kortPeriode.info" values={intlValues} />
                    </p>
                    <SøknadsperioderMånedListe
                        periode={periode}
                        årstallHeadingLevel={3}
                        månedContentRenderer={månedContentRenderer}
                    />
                </>
            )}
        </FormikInputGroup>
    );
};

export default ArbeidstidVariert;
