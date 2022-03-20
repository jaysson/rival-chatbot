import { Message } from './api';

export interface Solver {
  solve(message: Message): Promise<string | string[] | void>;
}
