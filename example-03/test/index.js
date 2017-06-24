const WebDriver = require('selenium-webdriver');
const until = WebDriver.until;
const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
const SERVER_PORT = 4444;
const convert = require('cyrillic-to-latin');

const server = new SeleniumServer('./../../driver/selenium-server-standalone-3.0.1.jar', {
    port: SERVER_PORT,
    jvmArgs: ['-Dwebdriver.chrome.driver=./../../driver/chromedriver']
});

server.start();

const list = require('./../names.json');

setTimeout(() => {

    function doIt(fio) {

        driver = new WebDriver
            .Builder()
            .usingServer('http://localhost:' + SERVER_PORT + '/wd/hub')
            .withCapabilities({'browserName': 'chrome'})
            .build();

        driver.get('http://google.com');

        console.log(fio);

        const data = getData(fio);

        driver.findElement(WebDriver.By.css('#first_name')).sendKeys(data.name);
        driver.findElement(WebDriver.By.css('#last_name')).sendKeys(data.lastName);
        driver.findElement(WebDriver.By.css('.js-email-sign')).sendKeys(data.email);
        driver.findElement(WebDriver.By.css('input[name="city"]')).sendKeys(data.city);
        // driver.findElement(WebDriver.By.css('.js-sign-button')).click();

        driver.sleep(20e3);

        return driver.quit();
    }

    let prom = Promise.resolve();

    list.forEach(value => {
        prom = prom.then(() => doIt(value));
    });

}, 1e3);

function getData(fio) {
    const data = {
        original: {
            name: fio.split(' ')[1],
            lastName: fio.split(' ')[0]
        },
        name: '',
        lastName: '',
        email: '',
        city: ''
    };

    if (Math.random() > 0.5) {
        data.name = convert(data.original.name);
        data.lastName = convert(data.original.lastName);
    } else {
        data.name = data.original.name;
        data.lastName = data.original.lastName;
    }

    if (Math.random() > 0.5) {
        data.email = convert(data.original.name) + '.' + convert(data.original.lastName)
    } else {
        data.email = convert(data.original.lastName) + '.' + convert(data.original.name)
    }

    data.email += '@';

    const emailDomains = ['gmail.com', 'gmail.com', 'gmail.com', 'mail.ru', 'mail.ru', 'yandex.ru'].sort(() => Math.random() > 0.5);

    data.email += emailDomains[0];

    data.city = Math.random() > 0.5 ? 'Minsk' : 'Минск';

    return data;

}
