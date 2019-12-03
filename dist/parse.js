"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
function isOption(str) {
    return str.charAt(0) === '-';
}
function findOption(options, optionName) {
    const target = optionName.replace(/^-{2}|^-{1}/, '');
    if (options) {
        const option = options.find((option) => option.short === target || option.long === target);
        if (option) {
            return option;
        }
        else {
            throw new errors_1.ArgError('E0001', [optionName]);
        }
    }
    else {
        throw new errors_1.ArgError('E0001', [optionName]);
    }
    return { short: '', long: '', useArg: false };
}
// only use subcommand flag true
function separateArgs(args, options) {
    if (args.length === 0)
        return { root: [], sub: [] };
    let errorFlag = false;
    const index = args.findIndex((cur, index, array) => {
        const prev = array[index - 1] || '';
        if (isOption(cur) && findOption(options, cur) instanceof Error) {
            errorFlag = true;
            return true;
        }
        if (!isOption(prev) && !isOption(cur))
            return true;
        if (isOption(prev) && !isOption(cur)) {
            const option = findOption(options, prev);
            if (!(option instanceof Error) && !option.useArg)
                return true;
        }
    });
    if (errorFlag)
        throw new errors_1.ArgError('E0001', [args[index]]);
    const targetIndex = index === -1 ? Number.MAX_SAFE_INTEGER : index;
    return {
        root: args.slice(0, targetIndex),
        sub: args.slice(targetIndex)
    };
}
exports.separateArgs = separateArgs;
function parseArgs(args, options) {
    const parseReducer = {
        response: {
            args: [],
            options: {}
        },
        prevOption: null
    };
    const ret = args.reduce((acc, cur) => {
        if (acc instanceof Error)
            return acc;
        if (acc.prevOption) {
            if (isOption(cur)) {
                throw new errors_1.ArgError('E0002', [cur]);
            }
            else {
                acc.response.options[acc.prevOption.short] = cur;
                acc.response.options[acc.prevOption.long] = cur;
            }
            acc.prevOption = null;
        }
        else if (isOption(cur)) {
            const option = findOption(options, cur);
            if (option.useArg) {
                acc.prevOption = option;
            }
            else {
                acc.response.options[option.short] = true;
                acc.response.options[option.long] = true;
            }
        }
        else {
            acc.response.args.push(cur);
        }
        return acc;
    }, parseReducer);
    return ret.response;
}
exports.parseArgs = parseArgs;
