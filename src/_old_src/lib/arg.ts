import minimist, { ParsedArgs } from 'minimist';

export function parse (args: string[]): ParsedArgs {
  return minimist(args.slice(2), {
    stopEarly: true,
    boolean: true
  });
}

const argv = parse(process.argv);
const subcommand = argv._.shift() as string;
const options = argv._;

export const args: {
  subcommand: string,
  options: string[]
} = {
  subcommand: subcommand,
  options: options
};
