import { separateArgs, parseArgs } from './parse'
import { Command, SubCommand, CommandRoute, Option, ParsedArgs, SeparatedArgs } from './types'
import { errorExit, ArgError } from './errors'

function findSubCommand (commands: SubCommand[], name: string): SubCommand {
  const response = commands.find((command: SubCommand) => command.name === name || command.alias === name);
  if (!response) throw new ArgError('E0003', [name]);
  return response;
}

export function makeCommand (route: CommandRoute) {
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
          route.root.action(parsedRoot);
          subCommand.action(parsedSub);
        } else {
          route.root.action(parsedRoot);
        }

      } else {
        const rootOptions = route.root.options || [];
        const parsedRoot = parseArgs(args, rootOptions);
        route.root.action(parsedRoot);
      }
    } catch (e) {
      errorExit(e);
    }
  }
}
