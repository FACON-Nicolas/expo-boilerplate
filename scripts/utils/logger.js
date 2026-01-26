const isDryRunMode = process.argv.includes('--dry-run');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

const info = (message) => {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
};

const success = (message) => {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
};

const warning = (message) => {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
};

const error = (message) => {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
};

const dryRun = (action) => {
  console.log(`${colors.magenta}[DRY-RUN]${colors.reset} ${action}`);
};

const step = (number, total, message) => {
  console.log(`${colors.cyan}[${number}/${total}]${colors.reset} ${message}`);
};

const header = (title) => {
  console.log('');
  console.log(`${colors.bold}${colors.cyan}═══ ${title} ═══${colors.reset}`);
  console.log('');
};

const divider = () => {
  console.log(`${colors.gray}${'─'.repeat(50)}${colors.reset}`);
};

const list = (items) => {
  items.forEach((item) => {
    console.log(`  ${colors.gray}•${colors.reset} ${item}`);
  });
};

const isDryRun = () => isDryRunMode;

module.exports = {
  info,
  success,
  warning,
  error,
  dryRun,
  step,
  header,
  divider,
  list,
  isDryRun,
  colors,
};
