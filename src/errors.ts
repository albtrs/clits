export class ArgError extends Error {
  code: string;
  args: string[];

  constructor (code: string, args: string[]) {
    super();
    this.code = code;
    this.args = args;
  }
}

type ErrorMessages = {
  [key: string]: string
}

export const ERROR_MESSAGES = {
  E0001: 'option not found: %s',
  E0002: 'invalid option argument: %s',
  E0003: 'subcommand not found: %s'
}

export function errorExit(error: ArgError) {
  const messages: ErrorMessages = ERROR_MESSAGES;
  console.error(`${error.code}: ${messages[error.code]}`, ...error.args);
  console.error(error.stack)
  process.exit(1);
}
