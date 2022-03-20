export type Message = {
  text: string;
};

export type Team = {
  name: string;
  city: string;
  sport: string;
  league: string;
  year: string;
};

export interface ChallengeApiContract {
  createAccount(data: { email: string; name: string }): Promise<string>;
  initConversation(userId: string): Promise<string>;
  getMessages(conversationId: string): Promise<Message[]>;
  answer(conversationId: string, message: string): Promise<boolean>;
  getTeams(): Promise<Team[]>;
}
