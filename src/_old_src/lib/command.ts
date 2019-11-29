export interface SubCommand {
  name: string,
  alias?: string[],
  validOptions?: string[],
  action: (options: string[]) => void,
}

export function invoke (commandList: SubCommand[], commandKey: string, argOptions: string[]) {
  const subCommand = commandList.find((command: SubCommand) => {
    const aliases = command.alias || [];
    return aliases.concat(command.name).some((alias: string) => alias === commandKey);
  });

  if (subCommand) {
    const validOptions = subCommand.validOptions;

    if (validOptions && argOptions.length > 0) {
      const exist = validOptions.some((option: string) => {
        return argOptions.some((x: string) => option === x);
      });

      if (exist) {
        subCommand.action(argOptions);
      } else {
        console.log('invalid option');
      }

    } else {
      subCommand.action([] as string[]);
    }

  } else {
    console.log('subcommand not found');
    process.exit(1);
  }
}
