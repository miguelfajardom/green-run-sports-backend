import { BetResultEnum } from "src/enums/bet-result.enum";
import { BetsResultDto} from "src/modules/bets/dto/settled-bet.dto";
import { InvalidBetOptionException, MultipleWinningOptionsException } from "./exceptions.utils";
import { Bet } from "src/modules/bets/entities/bet.entity";

export async function validateBetOptions(betOptions: BetsResultDto[], eventBets: Bet[]): Promise<void> {

  const betOptionsWithWon = betOptions.filter((betOption) => betOption.result === BetResultEnum.WON);

  if (betOptionsWithWon.length === 1) {
    for (const betOption of betOptions) {
      if (betOption.result !== BetResultEnum.WON) {
        betOption.result = BetResultEnum.LOST;
      }
    }
  } else {
    throw new InvalidBetOptionException();
  }

}
