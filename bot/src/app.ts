import { By, ThenableWebDriver } from "selenium-webdriver";
import { db_client,  } from "./db";
import {createDriver } from "./scrapping";
import fs from "fs";
import { sentry, transaction } from "./sentry";
import { closeTesseractWorker, inicialiceTesseractWorker, ocr, prepareImage, sleep } from "./utils";
import path from "path";

async function retry(fn, args = [], retries = 3, ) {
    let result;
    for (let i = 0; i < retries; i++) {
        try {
            result = await fn(...args);
            break;
        } catch (e) {
            console.log(`retry ${i}`);
            console.log(e);
        }
    }
}

async function getPage(driver: ThenableWebDriver, url="http://siat.impuestos.gob.bo"): Promise<boolean> {
    let result = false;
    try {
        await driver.get(url);
        result = true;
    } catch (error) {
        console.log(error)
        result = false;


    }
    return result;
}

(
    async () => {;
        let driverType: 'chrome' | 'firefox' = 'chrome';
        let driver = createDriver(driverType, true)
        await inicialiceTesseractWorker();
        // await db_client.connect()
        await driver.get("https://siat.impuestos.gob.bo")
        // await retry(getPage, [driver, 'http://siat.impuestos.gob.bo'], 3)
        // await driver.wait(function() {
        //     return driver.executeScript('return document.readyState').then(function(readyState) {
        //       return readyState === 'complete';
        //     });
        //   });
        await driver.sleep(1000)

        // wait until the login form is loaded
        await driver.wait(() => {
            return driver.executeScript(
                "return document.getElementById('form') !== null"
            ).then(function(ready) {
                return !!ready === true;
            });
        }, 10000)

        const captcha = await driver.findElement(By.id('form:captcha'));
        await sleep(2000)
        const file = path.resolve('./captcha.png')
        // setTimeout(async () => {
        //     await captcha.takeScreenshot().then(async (data) => {
        //         fs.writeFileSync(file, data, 'base64');
        //         const text = await ocrWorker.recognize(file);
        //         console.log(text);
        //         await driver.findElement(By.id('form:captcha')).sendKeys(text.data.text);
        //     });
        // }, 5000)
        // captcha.takeScreenshot().then(function(data) {
        //     fs.writeFileSync(file, data, 'base64');
        // });
        const captcha_src = await captcha.getAttribute('src');
        // console.log(captcha_src);

        // open new window
        await driver.executeScript(`window.open("${captcha_src}", "_blank");`);
        // switch to new window
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        // wait until the image is loaded
        await sleep(2000)
        // find the image
        const image_element = await driver.findElement(By.css('img'));
        const image_base64 = await image_element.takeScreenshot()
        // image buffer from base64
        const image_buffer = Buffer.from(image_base64, 'base64');
        const prepared_buffer = await prepareImage(image_buffer);

        // close the new window
        await driver.close();
        // switch back to the original window
        await driver.switchTo().window(handles[0]);
        // await prepareImage(file, "background")
        const text = await ocr(prepared_buffer);
        console.log(text);
    
        // const text = await ocrWorker.recognize(file);
        
        // await download(captcha_src, './captcha.png')
        // 
        // await driver.manage()

        // get UserSIN cokkie and modify it
        // let cookies = await driver.manage().getCookies()
        // console.log(cookies)
        // let cookie = cookies.find(c => c.name === 'UserSIN')
        // if (cookie) {
        //     cookie.value = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW51eGVyMDciLCJvZmljaW5hIjoiSDRzSUFBQUFBQUFBQURNQUFDSGYyX1FCQUFBQSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTNNVGN4c1RBMk1EUUdBRXZabm5nS0FBQUEiLCJpZCI6MTU1OTI5OCwiZXhwIjoxNjQyMDM2Mzg0LCJpYXQiOjE2NDIwMjE5MjQsImRlcGVuZGVuY2lhIjoiSDRzSUFBQUFBQUFBQURNME1BQUE2bEIzSXdNQUFBQT0ifQ.iWzxqRR3QdrBBujCFxGO1ZXM6RflF5DZuyb-_LnAD2SOGWlLXTLFtliuRYrMVKT2Q16ptJSLhtJ8Po_nCPH26w'
        //     await driver.manage().deleteCookie(cookie.name)
        //     await driver.manage().addCookie(cookie)
        // } else{
        //     // set UserSIN cookie
        //     await driver.manage().addCookie({
        //         name: 'UserSIN',
        //         value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW51eGVyMDciLCJvZmljaW5hIjoiSDRzSUFBQUFBQUFBQURNQUFDSGYyX1FCQUFBQSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTNNVGN4c1RBMk1EUUdBRXZabm5nS0FBQUEiLCJpZCI6MTU1OTI5OCwiZXhwIjoxNjQyMDM2Mzg0LCJpYXQiOjE2NDIwMjE5MjQsImRlcGVuZGVuY2lhIjoiSDRzSUFBQUFBQUFBQURNME1BQUE2bEIzSXdNQUFBQT0ifQ.iWzxqRR3QdrBBujCFxGO1ZXM6RflF5DZuyb-_LnAD2SOGWlLXTLFtliuRYrMVKT2Q16ptJSLhtJ8Po_nCPH26w',
        //         domain: 'siat.impuestos.gob.bo',
        //         path: '/',
        //         secure: false,
        //         httpOnly: true,
        //         expiry: (new Date())
        //     })
        // }

        // set userSIN cookie
        // await driver.manage().addCookie({
        //     name: 'UserSIN',
        //     value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW51eGVyMDciLCJvZmljaW5hIjoiSDRzSUFBQUFBQUFBQURNQUFDSGYyX1FCQUFBQSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTNNVGN4c1RBMk1EUUdBRXZabm5nS0FBQUEiLCJpZCI6MTU1OTI5OCwiZXhwIjoxNjQyMDM2Mzg0LCJpYXQiOjE2NDIwMjE5MjQsImRlcGVuZGVuY2lhIjoiSDRzSUFBQUFBQUFBQURNME1BQUE2bEIzSXdNQUFBQT0ifQ.iWzxqRR3QdrBBujCFxGO1ZXM6RflF5DZuyb-_LnAD2SOGWlLXTLFtliuRYrMVKT2Q16ptJSLhtJ8Po_nCPH26w',
        //     domain: 'siat.impuestos.gob.bo',
        //     path: '/',
        //     secure: false,
        //     httpOnly: true,
        //     expiry: (new Date())
        // })

        // set UserSIN cookie via javascript
        await driver.executeScript(`
        document.cookie = "UserSIN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW51eGVyMDciLCJvZmljaW5hIjoiSDRzSUFBQUFBQUFBQURNQUFDSGYyX1FCQUFBQSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTNNVGN4c1RBMk1EUUdBRXZabm5nS0FBQUEiLCJpZCI6MTU1OTI5OCwiZXhwIjoxNjQyMDM2Mzg0LCJpYXQiOjE2NDIwMjE5MjQsImRlcGVuZGVuY2lhIjoiSDRzSUFBQUFBQUFBQURNME1BQUE2bEIzSXdNQUFBQT0ifQ.iWzxqRR3QdrBBujCFxGO1ZXM6RflF5DZuyb-_LnAD2SOGWlLXTLFtliuRYrMVKT2Q16ptJSLhtJ8Po_nCPH26w,path=/,httponly=true";
        `)
        
        // const image = await download(captcha_src, file)

        // await sleep(100000)

        

        // navigate to the page productos/secure/GestionProductos.xhtml via javascript
        await driver.get('https://siat.impuestos.gob.bo/productos/secure/GestionProductos.xhtml')

        // // refresh the page
        // await driver.get("https://siat.impuestos.gob.bo/productos/secure/GestionProductos.xhtml")
        let page = await driver.sleep(500000)
        let title = await driver.getTitle()
        console.log(title)
        await driver.close()
        await closeTesseractWorker()
        // await db_client.end()
    }
)()