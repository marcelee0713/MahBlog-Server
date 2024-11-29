import { injectable } from "inversify";
import {
  BlogScoresCalculatedData,
  IBlogScores,
} from "../../ts/interfaces/blog/blog.scores.interface";

@injectable()
export class BlogScores implements IBlogScores {
  calculate(likes: number, comments: number, createdAt: Date): BlogScoresCalculatedData {
    const daysSincePublished = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    const decayRate = 0.01;

    const bestScore = (likes * 2 + comments * 1) * Math.pow(1 - decayRate, daysSincePublished);

    const controversialScore =
      (comments / (likes + 1)) * Math.pow(1 - decayRate, daysSincePublished);

    return {
      bestScore,
      controversialScore,
    };
  }
}
