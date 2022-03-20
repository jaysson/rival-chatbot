import { Message } from '../contracts/api';
import { Solver } from '../contracts/solver';

export default class AlphabetizationSolver implements Solver {
  async solve(message: Message): Promise<string | void> {
    const [description, inputsString] = message.text.split(/[:?]/g);
    if (!inputsString) {
      return;
    }
    if (this.solvable(description)) {
      const words = inputsString.split(',').map(this.sanitizeWord);
      return this.alphabetize(words).join(',');
    }
  }

  /**
   * Remove all non word characters
   * @param word
   * @returns Sanitized word
   */
  private sanitizeWord(word: string): string {
    return word.replace(/\W/g, '');
  }

  private solvable(message: string): boolean {
    return message.includes('alphabetize');
  }

  /**
   * Sort words alphabetically without case sensitivity
   * @param inputs List of words to alphabetize
   */
  private alphabetize(inputs: string[]): string[] {
    return inputs.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }
}
