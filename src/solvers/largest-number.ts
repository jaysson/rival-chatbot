import { Message } from '../contracts/api';
import { Solver } from '../contracts/solver';

export default class LargestNumberSolver implements Solver {
  async solve(message: Message): Promise<string | void> {
    const [description, inputsString] = message.text.split(':');
    if (!inputsString) {
      return;
    }
    if (this.solvable(description)) {
      const inputs = inputsString
        .split(',')
        .map((chunk) => chunk.replace(/\D/g, ''))
        .map(Number);
      return this.findLargest(inputs).toString();
    }
  }

  private solvable(message: string): boolean {
    return message.includes('largest');
  }

  private findLargest(inputs: number[]): number {
    return inputs.reduce((largest, current) => Math.max(largest, current), 0);
  }
}
