import { Option, ParsedArgs, SeparatedArgs } from './types'
import { ArgError } from './errors'

function isOption (str: string): boolean {
  return str.charAt(0) === '-';
}

function findOption (options: Option[] , optionName: string): Option {
  const target = optionName.replace(/^-{2}|^-{1}/, '');
  if (options) {
    const option = options.find((option: Option) => option.short === target || option.long === target);
    if (option) {
      return option;

    } else {
      throw new ArgError('E0001', [optionName]);
    }
  } else {
    throw new ArgError('E0001', [optionName]);
  }

  return { short: '', long: '', useArg: false };
}

// only use subcommand flag true
export function separateArgs (args: string[], options: Option[]): SeparatedArgs {
  if (args.length === 0) return { root: [], sub: [] };

  let errorFlag = false;
  const index = args.findIndex((cur: string, index: number, array: string[]) => {
    const prev = array[index-1] || '';
    if (isOption(cur) && findOption(options, cur) instanceof Error) {
      errorFlag = true;
      return true;
    }

    if (!isOption(prev) && !isOption(cur)) return true;

    if (isOption(prev) && !isOption(cur)) {
      const option = findOption(options, prev);
      if (!(option instanceof Error) && !option.useArg) return true;
    }
  });

  if (errorFlag) throw new ArgError('E0001', [args[index]])

  const targetIndex = index === -1 ? Number.MAX_SAFE_INTEGER : index;
  return {
    root: args.slice(0, targetIndex),
    sub: args.slice(targetIndex)
  }
}

export function parseArgs (args: string[], options: Option[]): ParsedArgs {
  type ParseReducer = {
    response: ParsedArgs;
    prevOption: Option | null;
  }

  const parseReducer = {
    response:  {
      args:[],
      options: {}
    },
    prevOption: null
  };

  const ret = args.reduce((acc: ParseReducer, cur: string) => {
    if (acc instanceof Error) return acc;

    if (acc.prevOption) {
      if (isOption(cur)) {
        throw new ArgError('E0002', [cur]);

      } else {
        acc.response.options[acc.prevOption.short] = cur;
        acc.response.options[acc.prevOption.long] = cur;
      }
      acc.prevOption = null;

    } else if (isOption(cur)) {
      const option = findOption(options, cur);
      if (option.useArg) {
        acc.prevOption = option;

      } else {
        acc.response.options[option.short] = true;
        acc.response.options[option.long] = true;
      }
    } else {
      acc.response.args.push(cur);
    }

    return acc;
  }, parseReducer);

  return ret.response;
}
