const builder = {
  forBrowser: jest.fn(() => builder),
  usingServer: jest.fn(() => builder),
  build: jest.fn(() => new Driver()),
  setChromeOptions: jest.fn(() => builder),
  setFirefoxOptions: jest.fn(() => builder),
};

const driver = {
  quit: jest.fn(),
  findElement: jest.fn(),
  findElements: jest.fn(),
};

function Builder() {
  return builder;
}

function Driver() {
  return driver;
}

const By = {};
const until = {};

exports.Builder = Builder;
exports.By = By;
exports.until = until;
