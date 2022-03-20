import { Message, Team } from '../contracts/api';
import { Solver } from '../contracts/solver';
import SportsTeamsRepository from '../repositories/sports-teams';

export default class EstablishedYearQuestionSolver implements Solver {
  private teamsRepository = new SportsTeamsRepository();

  async solve(message: Message): Promise<string | void> {
    if (this.solvable(message.text)) {
      const year = message.text.match(/\d{4}/g)?.[0];
      const allTeams = await this.teamsRepository.getTeams();
      const teams = allTeams
        .filter((team) => team.year === year)
        .map((team) => team.name)
        .join(',');
      return teams;
    }
  }

  private solvable(message: string): boolean {
    return message.includes('established in');
  }
}
