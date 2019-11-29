import { makeCommand } from './commander'

const rootOptions = [
  { short: 'i', long: 'input',  useArg: true },
  { short: 'o', long: 'output', useArg: true },
  { short: 'd', long: 'debug',  useArg: false }
];

const subOptions = [
  { short: 'f', long: 'file',  useArg: true },
  { short: 'g', long: 'global', useArg: false },
  { short: 'o', long: 'output', useArg: true },
];

function doTest (params: any) {
  console.log('doTest');
  console.log(params);
}

const commands = {
  root: {
    options: rootOptions,
    action: doTest
  },
  subs: [
    {
      name: 'new',
      alias: 'n',
      options: subOptions,
      action: doTest
    },
    {
      name: 'edit',
      action: doTest
    }
  ]
}

const rootOnlyCommands = {
  root: {
    options: rootOptions,
    action: doTest
  }
}

const args = process.argv.slice(2);

console.log('sub nashi')
const onlyCommand = makeCommand(rootOnlyCommands);
onlyCommand(args);

console.log('sub ari')
const command = makeCommand(commands);
command(args);

