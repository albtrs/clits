import { separateArgs, parseArgs } from './parse'
import { Command, Chain, SubCommand, CommandRoute, Option, ParsedArgs, SeparatedArgs } from './types'
import { errorExit, ArgError } from './errors'

function findSubCommand (commands: SubCommand[], name: string): SubCommand {
  const response = commands.find((command: SubCommand) => command.name === name || command.alias === name);
  if (!response) throw new ArgError('E0003', [name]);
  return response;
}

export default function makeCommand (route: CommandRoute) {
  return (args: string[]) => {
    try {
      if (route.subs) {
        const rootOptions = route.root.options || [];
        const separated = separateArgs(args, rootOptions);
        const parsedRoot = parseArgs(separated.root, rootOptions);
        const subCommandName = separated.sub.shift() || '';
        if (subCommandName !== '') {
          const subCommand = findSubCommand(route.subs, subCommandName);
          const subOptions = subCommand.options || []
          const parsedSub = parseArgs(separated.sub, subOptions);
          const parentObj = route.root.action(parsedRoot);
          subCommand.action(parsedSub, parentObj);

        } else {
          route.root.action(parsedRoot);
        }

      } else {
        const rootOptions = route.root.options || [];
        const parsedRoot = parseArgs(args, rootOptions);
        route.root.action(parsedRoot);
      }
    } catch (e) {
      if (e instanceof ArgError) {
        errorExit(e);
      } else {
        console.error(e);
      }
    }
  }
}
