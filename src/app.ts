import { ChallengeApiContract, Message } from './contracts/api';
import { Solver } from './contracts/solver';
import { User } from './contracts/user';
import AlphabetizationSolver from './solvers/alphabetize';
import BaseballTeamQuestionSolver from './solvers/baseball';
import BooleanSolver from './solvers/boolean';
import EstablishedYearQuestionSolver from './solvers/established-year';
import EvenLetterWordsSolver from './solvers/even-letters';
import LargestNumberSolver from './solvers/largest-number';
import NHLTeamsQuestionSolver from './solvers/nhl';
import SumSolver from './solvers/sum';

export default class Application {
  private solvers: Solver[] = [];
  private conversationId: string = '';
  private userId: string = '';

  constructor(private user: User, private apiClient: ChallengeApiContract) {}

  async start() {
    this.registerSolvers();
    await this.createUser();
    await this.createConversation();
    return this.chat();
  }

  /**
   * According to the given flow diagram, conversation creation should be retried if it fails.
   * The diagram doesn't specify any maximum number of retries or timeouts, thus it's not included here.
   * However, exponential backoff and maximum retries are important for production applications.
   */
  async createConversation(): Promise<void> {
    this.output(`Starting conversation`);
    try {
      this.conversationId = await this.apiClient.initConversation(this.userId);
      if (!this.conversationId) {
        return this.createConversation();
      }
      this.output(`Conversation started with id ${this.conversationId}`);
    } catch (e) {
      this.createConversation();
    }
  }

  /**
   * According to the given flow diagram, registration should be retried if it fails.
   * The diagram doesn't specify any maximum number of retries or timeouts, thus it's not included here.
   * However, exponential backoff and maximum retries are important for production applications.
   */
  async createUser(): Promise<void> {
    this.output('Creating account');
    try {
      this.userId = await this.apiClient.createAccount(this.user);
      if (!this.userId) {
        return this.createUser();
      }
      this.output(`Account created with id ${this.userId}`);
    } catch (e) {
      this.createUser();
    }
  }

  /**
   * The question-answer loop
   *
   * @returns Whether the conversation is over
   */
  async chat(): Promise<boolean> {
    const messages = await this.apiClient.getMessages(this.conversationId);
    if (this.isConversationOver(messages)) {
      this.output('Conversation over!');
      return true;
    }
    this.presentMessages(messages);
    const answerPromises = this.solvers.map(async (solver) =>
      solver.solve(messages[messages.length - 1]),
    );
    const answers = (await Promise.all(answerPromises)).filter(Boolean).flat() as string[];
    const foundRightAnswer = await this.tryAnswers(answers);
    // We don't have a solver for the current question. It's time to accept defeat!
    if (!foundRightAnswer) {
      this.output('Could not find the right answer.');
      return false;
    }
    return this.chat();
  }

  registerSolvers() {
    this.solvers.push(new BooleanSolver());
    this.solvers.push(new SumSolver());
    this.solvers.push(new LargestNumberSolver());
    this.solvers.push(new EvenLetterWordsSolver());
    this.solvers.push(new AlphabetizationSolver());
    this.solvers.push(new NHLTeamsQuestionSolver());
    this.solvers.push(new BaseballTeamQuestionSolver());
    this.solvers.push(new EstablishedYearQuestionSolver());
  }

  /**
   * Try all answers in the given array. We continue until we find the right answer.
   *
   * @param answers Answers to send to the challenge
   * @returns Whether a correct answer was given
   */
  async tryAnswers(answers: string[]) {
    for await (const answer of answers) {
      const correct = await this.apiClient.answer(this.conversationId, answer);
      if (correct) {
        this.presentAnswer(answer);
        return true;
      }
    }
    return false;
  }

  isConversationOver(messages: Message[]) {
    const message = messages[messages.length - 1];
    return message.text.includes('Thank you');
  }

  presentMessages(messages: Message[]) {
    messages.forEach((message) => {
      this.output(`ChatBot says: ${message.text}`);
    });
  }

  presentAnswer(answer: string) {
    this.output(`${this.user.name} says: ${answer}`);
  }

  output(message: string) {
    console.log(message);
  }
}
