export interface Option {
  short: string;
  long: string;
  useArg: boolean;
}

export interface ParsedArgs {
  args: string[];
  options: { [key: string]: string | boolean };
}

export interface SeparatedArgs {
  root: string[];
  sub: string[];
}

export interface Command {
  options?: Option[];
  action: (params: any) => void;
}

export interface SubCommand extends Command {
  name: string;
  alias?: string;
}

export interface CommandRoute {
  root: Command;
  subs?: SubCommand[];
}
