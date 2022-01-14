import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { db_client,  } from "./db";
import {createDriver } from "./scrapping";
import fs from "fs";
import { sentry, transaction } from "./sentry";
import { closeTesseractWorker, inicialiceTesseractWorker, ocr, prepareImage, sleep } from "./utils";


async function getCatpchaText(driver: ThenableWebDriver, captcha_src: string) {
    await sleep(2000)
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
    return text;
}

(
    async () => {;
        let driverType: 'chrome' | 'firefox' = 'chrome';
        let driver = createDriver(driverType, false)
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
        let captcha_text = ''
        let atempts = 0
        while (captcha_text.length !== 6) {
            // rfresh captcha
            atempts++
            let captcha_src: string;
            if(atempts > 1) {
                // refresh captcha

                // find by xpath regexp expression contains id="form"
                const refres_button = await driver.findElement(By.xpath(`//button[contains(@id, 'form:j_idt')]`));

                // const refres_button = await driver.findElement(By.xpath('contains(@id, "form")'))"]'));
                await refres_button.click();
                await sleep(1000)
                const captcha = await driver.findElement(By.id('form:captcha'));
                captcha_src = await captcha.getAttribute('src');
            } else{
                const captcha = await driver.findElement(By.id('form:captcha'));
                captcha_src = await captcha.getAttribute('src');
            }
            captcha_text = await getCatpchaText(driver, captcha_src)
        }
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