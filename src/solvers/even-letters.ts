import { Message } from '../contracts/api';
import { Solver } from '../contracts/solver';

export default class EvenLetterWordsSolver implements Solver {
  async solve(message: Message): Promise<string | void> {
    const [description, inputsString] = message.text.split(/[:?]/g);
    if (!inputsString) {
      return;
    }
    if (this.solvable(description)) {
      const words = inputsString.split(',').map(this.sanitizeWord);
      return this.findWordsWithEvenNumberOfLetters(words).join(',');
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
    return message.includes('even number of letters');
  }

  private findWordsWithEvenNumberOfLetters(inputs: string[]): string[] {
    return inputs.filter((word) => word.length % 2 === 0);
  }
}
