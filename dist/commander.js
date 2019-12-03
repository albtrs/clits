"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./parse");
const errors_1 = require("./errors");
function findSubCommand(commands, name) {
    const response = commands.find((command) => command.name === name || command.alias === name);
    if (!response)
        throw new errors_1.ArgError('E0003', [name]);
    return response;
}
function makeCommand(route) {
    return (args) => {
        try {
            if (route.subs) {
                const rootOptions = route.root.options || [];
                const separated = parse_1.separateArgs(args, rootOptions);
                const parsedRoot = parse_1.parseArgs(separated.root, rootOptions);
                const subCommandName = separated.sub.shift() || '';
                if (subCommandName !== '') {
                    const subCommand = findSubCommand(route.subs, subCommandName);
                    const subOptions = subCommand.options || [];
                    const parsedSub = parse_1.parseArgs(separated.sub, subOptions);
                    const parentObj = route.root.action(parsedRoot);
                    subCommand.action(parsedSub, parentObj);
                }
                else {
                    route.root.action(parsedRoot);
                }
            }
            else {
                const rootOptions = route.root.options || [];
                const parsedRoot = parse_1.parseArgs(args, rootOptions);
                route.root.action(parsedRoot);
            }
        }
        catch (e) {
            if (e instanceof errors_1.ArgError) {
                errors_1.errorExit(e);
            }
            else {
                console.error(e);
            }
        }
    };
}
exports.default = makeCommand;
