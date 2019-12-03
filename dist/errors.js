"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgError extends Error {
    constructor(code, args) {
        super();
        this.code = code;
        this.args = args;
    }
}
exports.ArgError = ArgError;
exports.ERROR_MESSAGES = {
    E0001: 'option not found: %s',
    E0002: 'invalid option argument: %s',
    E0003: 'subcommand not found: %s'
};
function errorExit(error) {
    const messages = exports.ERROR_MESSAGES;
    console.error(`${error.code}: ${messages[error.code]}`, ...error.args);
    console.error(error.stack);
    process.exit(1);
}
exports.errorExit = errorExit;
