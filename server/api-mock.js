const os = require('os');
const fs = require('fs');
const busboyCons = require('busboy');
const express = require('express');
const server = express();
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

server.use(express.json());
server.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080'];
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.indexOf(requestOrigin) >= 0) {
        res.set('Access-Control-Allow-Origin', requestOrigin);
    }

    res.removeHeader('X-Powered-By');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const MELLOMLAGRING_JSON = `${os.tmpdir()}/pleiepenger-i-livets-sluttfase-mellomlagring1.json`;

const isJSON = (str) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
};

const writeFileAsync = async (path, text) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const readFileSync = (path) => {
    return fs.readFileSync(path, 'utf8');
};

const existsSync = (path) => fs.existsSync(path);

const søkerMock = {
    fødselsnummer: '30086421581',
    fornavn: 'GODSLIG',
    mellomnavn: null,
    etternavn: 'KRONJUVEL',
    kontonummer: '17246746060',
};

const arbeidsgivereMock = [
    {
        navn: 'Arbeids- og velferdsetaten',
        organisasjonsnummer: '123451234',
        ansattFom: '2019-09-25',
        ansattTom: null,
    },
    {
        navn: 'Telenor',
        organisasjonsnummer: '09435628',
        ansattFom: '01.06.2021',
        ansattTom: '01.07.2021',
    },
    {
        navn: 'Arbeids- og sosialdepartementet',
        organisasjonsnummer: '123451235',
        ansattFom: '01.06.2018',
        ansattTom: '01.11.2021',
    },
    {
        navn: 'Tele2',
        organisasjonsnummer: '676789999',
        ansattFom: '01.06.2018',
        ansattTom: null,
    },
];
const frilansoppdrag = {
    type: 'type oppdrag',
    organisasjonsnummer: '991012133',
    navn: 'Hurdal frilanssenter',
    ansattFom: '2022-01-01',
    ansattTom: '2022-01-15',
};

const getArbeidsgiverMock = (from) => {
    return arbeidsgivereMock.filter((organisasjon) => {
        const sluttDato = organisasjon.ansattTom ? dayjs(organisasjon.ansattTom, 'DD.MM.YYYY') : dayjs();
        const fraDato = dayjs(from, 'YYYY-MM-DD');
        return sluttDato.isSameOrAfter(fraDato);
    });
};

const startExpressServer = () => {
    const port = process.env.PORT || 8089;

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));

    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get('/login', (req, res) => {
        setTimeout(() => {
            res.sendStatus(404);
        }, 2000);
    });

    server.get('/oppslag/soker', (req, res) => {
        setTimeout(() => {
            res.send(søkerMock);
        }, 200);
    });

    server.get('/oppslag/arbeidsgiver', (req, res) => {
        const arbeidsgivere = getArbeidsgiverMock(req.query.fra_og_med);
        res.send({ organisasjoner: arbeidsgivere, frilansoppdrag: [frilansoppdrag], privatarbeidsgiver: [] });
    });
    server.get('/soker-not-logged-in', (req, res) => {
        res.sendStatus(401);
    });
    server.get('/soker-err', (req, res) => {
        setTimeout(() => {
            res.sendStatus(501);
        }, 200);
    });

    server.get('/soker-logget-ut', (req, res) => {
        res.sendStatus(401);
    });

    server.post('/pleiepenger-livets-sluttfase/innsending', (req, res) => {
        const body = req.body;
        console.log('[POST] body', body);
        setTimeout(() => {
            res.sendStatus(200);
        }, 2500);
    });

    server.post('/soknad-logget-ut', (req, res) => {
        res.sendStatus(401);
    });

    server.get('/mellomlagring/PLEIEPENGER_LIVETS_SLUTTFASE', (req, res) => {
        if (existsSync(MELLOMLAGRING_JSON)) {
            const body = readFileSync(MELLOMLAGRING_JSON);
            res.send(JSON.parse(body));
        } else {
            res.send({});
        }
    });

    server.put('/mellomlagring/PLEIEPENGER_LIVETS_SLUTTFASE', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });

    server.post('/mellomlagring/PLEIEPENGER_LIVETS_SLUTTFASE', (req, res) => {
        const body = req.body;
        const jsBody = isJSON(body) ? JSON.parse(body) : body;
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify(jsBody, null, 2));
        res.sendStatus(200);
    });

    server.delete('/mellomlagring/PLEIEPENGER_LIVETS_SLUTTFASE', (req, res) => {
        writeFileAsync(MELLOMLAGRING_JSON, JSON.stringify({}, null, 2));
        res.sendStatus(200);
    });

    server.post('/vedlegg', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Location');
        res.set('Location', 'nav.no');
        const busboy = busboyCons({ headers: req.headers });
        busboy.on('finish', () => {
            res.writeHead(200, {
                Location: 'http://localhost:8083/vedlegg/eyJraWQiOiIxIiwidHlwIjoiSldUIiwiYWxnIjoibm9uZSJ9.eyJqdG',
            });
            res.end();
        });
        req.pipe(busboy);
    });

    server.listen(port, () => {
        console.log(`Express mock-api server listening on port: ${port}`);
    });
};

startExpressServer();
