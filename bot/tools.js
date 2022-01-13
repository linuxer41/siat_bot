import fetch from "node-fetch";
import FormData from 'form-data';
import fs from 'fs';
// create authetication POST FORM

function createAuthForm(username, password, nit, user_type) {

    // form: form
    // form:iTipoUsuarioId_focus: 
    // form:iTipoUsuarioId_input: 0
    // form:txtNit: 74744083013
    // form:txtUsuario: linuxer07
    // form:txtClave: Anarkia41?!
    // form:txtCaptchaId: TLq6CH
    // form:btnStartSession:


    const form = new FormData();
    form.append('form:iTipoUsuarioId_focus', '0');
    form.append('form:iTipoUsuarioId_input', 'TipoUsuario [tipoUsuarioId=862, descripcion=Contribuyente, placeholder=Nit contribuyente]');
    form.append('form:txtNit', nit);
    form.append('form:txtUsuario', username);
    form.append('form:txtClave', password);
    // form.append('form:txtCaptchaId', 'TLq6CH');
    form.append('form:btnStartSession', 'Iniciar Sesión');

    return form;
}

async function getSession(username, password, nit, user_type) {
        // Host: siat.impuestos.gob.bo
        // Origin: https://siat.impuestos.gob.bo
        // Referer: https://siat.impuestos.gob.bo/Autenticacion/index.xhtml?
        // sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"
        // sec-ch-ua-mobile: ?0
        // sec-ch-ua-platform: "Windows"
        // Sec-Fetch-Dest: document
        // Sec-Fetch-Mode: navigate
        // Sec-Fetch-Site: same-origin
        // Sec-Fetch-User: ?1
        // Upgrade-Insecure-Requests: 1
        // User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36
    const headers = {
        'Host': 'siat.impuestos.gob.bo',
        'Origin': 'https://siat.impuestos.gob.bo',
        'Referer': 'https://siat.impuestos.gob.bo/Autenticacion/index.xhtml?',
        'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',

    }
    const form = createAuthForm(username, password, nit, user_type);
    const response = await fetch('https://siat.impuestos.gob.bo/Autenticacion/index.xhtml', {
        method: 'POST',
        body: form,
        headers: headers
    });
    console.log(response.headers.get('set-cookie'));
    const text = await response.text();
    writeFile('./session.html', text);
    return text;
}

function writeFile(fileName, data) {
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}
(
    async function () {
        const username = 'linuxer07';
        const password = 'Anarkia41?!';
        const nit = '74744083013';
        const user_type = '0';
        const session = await getSession(username, password, nit, user_type);
        // console.log(session);
    }
)()