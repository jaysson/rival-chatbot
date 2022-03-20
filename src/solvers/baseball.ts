import { Message, Team } from '../contracts/api';
import { Solver } from '../contracts/solver';
import SportsTeamsRepository from '../repositories/sports-teams';

export default class BaseballTeamQuestionSolver implements Solver {
  private teamsRepository = new SportsTeamsRepository();

  async solve(message: Message): Promise<string | void> {
    const [description, inputsString] = message.text.split(/[:?]/g);
    if (this.solvable(description)) {
      const allTeams = await this.teamsRepository.getTeams();
      const teams = inputsString.split(',').map((name) => name.trim());
      return teams
        .filter((teamName) => allTeams.find((team) => team.name === teamName)?.sport === 'baseball')
        .join(',');
    }
  }

  private solvable(message: string): boolean {
    return message.includes('baseball team');
  }
}
