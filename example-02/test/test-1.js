const WebDriver = require('selenium-webdriver');
const until = WebDriver.until;
const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
const SERVER_PORT = 7070; // see ./adb -s 7cd23986 forward tcp:8080 tcp:8080

const server = new SeleniumServer('./../driver/selenium-server-standalone-3.0.1.jar', {
    port: SERVER_PORT,
    jvmArgs: ['-Dwebdriver.chrome.driver=./driver/linux/chromedriver']
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

        driver.wait(() => {
            console.log('wait for Math.random() > 0.95');
            return Math.random() > 0.9;
        }, 10e3);

        driver.findElement(WebDriver.By.css('#lst-ib')).sendKeys('username');
        driver.findElement(WebDriver.By.css('#lst-ib')).sendKeys(WebDriver.Key.ENTER);

        driver.get('https://statlex.github.com/');
        driver.sleep(5e3);

        return driver.get('https://yandex.com/');
    });

});
