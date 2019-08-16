const NodeEnvironment = require('jest-environment-node');
const { Builder, By, until, Capabilities } = require('selenium-webdriver');
require('selenium-webdriver/chrome')
require('selenium-webdriver/firefox');

class WebDriverEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    const options = config.testEnvironmentOptions || {};
    // Allow ENV to take precedence over package.json and then fallback to defaults
    this.browserName = process.env.BROWSER ||  options.browser || 'chrome';
    this.seleniumAddress = process.env.SELENIUM_ADDRESS || options.seleniumAddress || null;
    this.browserOptions = options.browserOptions || {};
  }

  async setup() {
    await super.setup();

    let driver = new Builder();
    if (this.seleniumAddress) {
      driver.usingServer(this.seleniumAddress);
    }
    driver.forBrowser(this.browserName);

    const args = [];
    if (this.browserName === "chrome") {
        const chromeCapabilities = Capabilities.chrome();
        for (const key in this.browserOptions) {
          let value = this.browserOptions[key];
          value = typeof value === "string" ? value : undefined;
          args.push(`--${key}${value ? `=${value}`: undefined}`)
        }
        if (args.length) {
            chromeCapabilities.set('chromeOptions', { args });
            driver.withCapabilities(chromeCapabilities);
        }
    }

    this.driver = await driver.build();

    this.global.by = By;
    this.global.browser = driver;
    this.global.element = locator => driver.findElement(locator);
    this.global.element.all = locator => driver.findElements(locator);
    this.global.until = until;
  }

  async teardown() {
    if (this.driver) {
      // https://github.com/alexeyraspopov/jest-webdriver/issues/8
      try {
        await this.driver.close();
      } catch (error) { }

      // https://github.com/mozilla/geckodriver/issues/1151
      try {
        await this.driver.quit();
      } catch (error) { }
    }

    await super.teardown();
  }
}

module.exports = WebDriverEnvironment;
