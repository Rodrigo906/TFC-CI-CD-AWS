import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const clientId = '2h4c5eelij0jl1989mugp1e0vn';
const clientSecret = '15ant1fe69461bppg29cvvv5e54immfktci91nugfsgdi8d3s84k';
const authServerUrl = 'https://autenticacion.auth.us-west-2.amazoncognito.com/oauth2/token';
const scope = 'autentication/auth';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // 10 usuarios concurrentes durante 30 segundos.
        { duration: '30s', target: 20 }, // Mantener 20 usuarios concurrentes durante 30 segundos.
        ],
    };

export default function () {
    const payload = `grant_type=client_credentials&scope=${scope}`;
    const authHeaders = {
        headers: {
            'Authorization': `Basic ${encoding.b64encode(`${clientId}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const response = http.post(authServerUrl, payload, authHeaders);
    check(response, {
        'Autenticación exitosa': (r) => r.status === 200,
    });

    const token = JSON.parse(response.body).access_token;
    const apiKeyHeaders = {
        headers: {
            'access-token': token,
        },
    };

    const apiUrl = 'https://ypy4dml901.execute-api.us-west-2.amazonaws.com/dev/users';
    const apiResponse = http.get(apiUrl, apiKeyHeaders);
    check(apiResponse, {
        'Solicitud exitosa': (r) => r.status === 200,
    });

    sleep(1);
}