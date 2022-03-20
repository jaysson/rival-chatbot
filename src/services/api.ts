import fetch from 'node-fetch';
import { ChallengeApiContract, Message, Team } from '../contracts/api';

export class ChallengeApi implements ChallengeApiContract {
  constructor(
    private baseURL: string = 'https://us-central1-rival-chatbot-challenge.cloudfunctions.net',
  ) {}

  /**
   * Retrieve the list of teams
   */
  async getTeams(): Promise<Team[]> {
    const url = `${this.baseURL}/challenge-behaviour/data`;
    const response = await fetch(url);
    const result = await response.json();
    return result.teams;
  }

  /**
   * Create account using email and name
   *
   * @returns user id
   */
  async createAccount(data: { email: string; name: string }): Promise<string> {
    const url = `${this.baseURL}/challenge-register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = (await response.json()) as { user_id: string };
    return result.user_id;
  }

  /**
   * Inititalize the conversation for the user
   *
   * @returns conversation id
   */
  async initConversation(userId: string): Promise<string> {
    const url = `${this.baseURL}/challenge-conversation`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    const result = (await response.json()) as { conversation_id: string };
    return result.conversation_id;
  }

  /**
   * Retrieve new messages for the conversation
   *
   * @returns List of message
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const url = `${this.baseURL}/challenge-behaviour/${conversationId}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = (await response.json()) as { messages: Message[] };
    return result.messages;
  }

  /**
   * Answer the message
   *
   * @returns whether the answer is correct
   */
  async answer(conversationId: string, message: string): Promise<boolean> {
    const url = `${this.baseURL}/challenge-behaviour/${conversationId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
    const result = (await response.json()) as { correct: boolean };
    return result.correct;
  }
}
