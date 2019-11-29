import ParsedArgs from 'minimist';
import { SubCommand, invoke } from './lib/command';
import { args, parse } from './lib/arg';

function doNew (options: string[]): void {
  const args = parse(options);
  console.log('new');
  console.log(options);
}

function doEdit (options: string[]): void {
  console.log('edit');
}

const routes: SubCommand[] = [
  {
    name: 'new',
    alias: ['n'],
    validOptions: ['-a', '-b'],
    action: doNew
  },
  {
    name: 'edit',
    action: doEdit
  },
];

invoke(routes, args.subcommand, args.options);
