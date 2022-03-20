import { Team } from '../contracts/api';
import { ChallengeApi } from '../services/api';

export default class SportsTeamsRepository {
  private teams: Team[] = [];

  async getTeams(): Promise<Team[]> {
    if (this.teams.length === 0) {
      this.teams = await new ChallengeApi().getTeams();
    }
    return this.teams;
  }
}
