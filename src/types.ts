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
  action: (params: ParsedArgs) => Chain;
}

export interface Chain {
  [key: string]: string
}

export interface SubCommand {
  name: string;
  alias?: string;
  options?: Option[];
  action: (params: ParsedArgs, chain: Chain) => void;
}

export interface CommandRoute {
  root: Command;
  subs?: SubCommand[];
}
