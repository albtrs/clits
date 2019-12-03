import { CommandRoute } from './types';
export default function makeCommand(route: CommandRoute): (args: string[]) => void;
