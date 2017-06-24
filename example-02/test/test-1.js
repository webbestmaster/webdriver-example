const WebDriver = require('selenium-webdriver');
const until = WebDriver.until;
const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
const SERVER_PORT = process.env.SERVER_PORT; // see ./adb -s 7cd23986 forward tcp:8080 tcp:8080
const assert = require('chai').assert;

const server = new SeleniumServer('./../driver/selenium-server-standalone-3.0.1.jar', {
    port: SERVER_PORT,
    jvmArgs: ['-Dwebdriver.chrome.driver=./../driver/chromedriver']
});

describe('test describe', function () {

    let driver = null;

    // each test should be less than 10s
    this.timeout(10e3);

    // before(() => server.start());

    after(() => server.stop());

    beforeEach(() => {
        driver = new WebDriver
            .Builder()
            .usingServer('http://localhost:' + SERVER_PORT + '/wd/hub')
            .withCapabilities({'browserName': 'chrome'})
            .build();
    });

    afterEach(() => driver.quit());

    it('test it', () => {
        driver.get('https://google.com/');

        driver.findElement(WebDriver.By.css('#lst-ib')).sendKeys('username');
        driver.findElement(WebDriver.By.css('#lst-ib')).sendKeys(WebDriver.Key.ENTER);

        return driver.getTitle().then(title => {
            console.log(title);
            assert(2 === 2);
        });

    });

});
