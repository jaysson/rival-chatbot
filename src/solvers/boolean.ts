import { Message } from '../contracts/api';
import { Solver } from '../contracts/solver';

export default class BooleanSolver implements Solver {
  async solve(message: Message): Promise<string[] | void> {
    if (this.isBooleanQuestion(message.text)) {
      return ['yes', 'no'];
    }
  }

  private isBooleanQuestion(message: string): boolean {
    return message.includes('ready');
  }
}
