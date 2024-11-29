import { ScoreType, UpdateBlogScoresParams } from "../../types/blog/blog.scores.types";

export interface IBlogScores {
  calculate: (likes: number, comments: number, createdAt: Date) => BlogScoresCalculatedData;
}

export interface IBlogScoresRepository {
  get: (type: ScoreType, id: string) => Promise<BlogScoresData>;
  update: (params: UpdateBlogScoresParams) => Promise<void>;
}

export interface BlogScoresCalculatedData {
  bestScore: number;
  controversialScore: number;
}

export interface BlogScoresData {
  scoresId: string;
  likes: number;
  comments: number;
  bestScore: number;
  controversialScore: number;
  type: ScoreType;
  createdAt: Date;
}
