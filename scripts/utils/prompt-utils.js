const readline = require('readline');
const logger = require('./logger');

const isForceMode = () => process.argv.includes('--force') || process.argv.includes('-y');
const isDryRunMode = () => process.argv.includes('--dry-run');

const createInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

const confirm = async (message) => {
  if (isForceMode()) {
    logger.info(`${message} (auto-confirmed with --force)`);
    return true;
  }

  const rl = createInterface();

  return new Promise((resolve) => {
    rl.question(`${logger.colors.yellow}?${logger.colors.reset} ${message} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
};

const select = async (message, options) => {
  if (isForceMode() && options.length > 0) {
    logger.info(`${message} (auto-selected first option with --force)`);
    return options[0].value;
  }

  const rl = createInterface();

  console.log(`${logger.colors.yellow}?${logger.colors.reset} ${message}`);
  options.forEach((option, index) => {
    console.log(`  ${logger.colors.cyan}${index + 1})${logger.colors.reset} ${option.label}`);
  });

  return new Promise((resolve) => {
    rl.question(`${logger.colors.gray}Enter number (1-${options.length}):${logger.colors.reset} `, (answer) => {
      rl.close();
      const index = parseInt(answer, 10) - 1;
      if (index >= 0 && index < options.length) {
        resolve(options[index].value);
      } else {
        resolve(options[0].value);
      }
    });
  });
};

const input = async (message, defaultValue = '') => {
  if (isForceMode() && defaultValue) {
    logger.info(`${message} (using default: ${defaultValue})`);
    return defaultValue;
  }

  const rl = createInterface();
  const defaultHint = defaultValue ? ` (${defaultValue})` : '';

  return new Promise((resolve) => {
    rl.question(`${logger.colors.yellow}?${logger.colors.reset} ${message}${defaultHint}: `, (answer) => {
      rl.close();
      resolve(answer || defaultValue);
    });
  });
};

const getArg = (index, fallback = null) => {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
  return args[index] || fallback;
};

const hasFlag = (flag) => {
  return process.argv.includes(flag) || process.argv.includes(`--${flag}`);
};

const getNamedArg = (name) => {
  const index = process.argv.findIndex((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`));

  if (index === -1) return null;

  const arg = process.argv[index];
  if (arg.includes('=')) {
    return arg.split('=')[1];
  }

  return process.argv[index + 1] || null;
};

module.exports = {
  confirm,
  select,
  input,
  isForceMode,
  isDryRunMode,
  getArg,
  hasFlag,
  getNamedArg,
};
