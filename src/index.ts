import yargs from 'yargs/yargs';
import Application from './app';
import { ChallengeApi } from './services/api';

async function main() {
  const user = await yargs(process.argv.slice(2)).options({
    name: { type: 'string', demandOption: true, alias: 'n', desc: 'Your name' },
    email: { type: 'string', demandOption: true, alias: 'e', desc: 'Your email address' },
  }).argv;

  return new Application(user, new ChallengeApi()).start();
}

main();
