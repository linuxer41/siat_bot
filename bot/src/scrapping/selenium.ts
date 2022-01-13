import { Builder, ThenableWebDriver } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import chrome from "selenium-webdriver/chrome";

export function createDriver(browser = "chrome", headless=false): ThenableWebDriver {
  
  const chromeOptions = new chrome.Options();
  if (headless) chromeOptions.addArguments("--headless");
  chromeOptions.addArguments("--no-sandbox");
  // chromeOptions.addArguments(
  //   "user-data-dir=C:\\Users\\linuxer\\AppData\\Local\\Google\\Chrome\\User Data"
  // );

  // Here you specify the actual profile folder
  // chromeOptions.addArguments("profile-directory=Default");
  // chromeOptions.addArguments(`--proxy-server=${proxyAddress}`)

  const firefoxOptions = new firefox.Options();
  firefoxOptions.setPreference("devtools.jsonview.enabled", false);
  if (headless) firefoxOptions.addArguments("--headless");
  // firefoxOptions.setProfile(
  //   `C:/Users/linuxer/AppData/Roaming/Mozilla/Firefox/Profiles/bm247x4l.default-release-1634057407071`
  // );

  let chromeService = new chrome.ServiceBuilder(process.platform === 'win32'? "./drivers/win/chromedriver.exe" : "./drivers/linux/chromedriver");
  let firefoxService = new firefox.ServiceBuilder(process.platform === 'win32'? "./drivers/win/geckodriver.exe": "./drivers/linux/geckodriver" );

  return new Builder()
    .setChromeService(chromeService)
    .setFirefoxService(firefoxService)
    .forBrowser(browser)
    .setChromeOptions(chromeOptions)
    .setFirefoxOptions(firefoxOptions)
    .build();
}
