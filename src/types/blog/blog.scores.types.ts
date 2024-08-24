import { BlogScoresData } from "../../interfaces/blog/blog.scores.interface";

export type ScoreType = "COMMENT" | "BLOG";

export type UpdateBlogScoresParams = Omit<BlogScoresData, "createdAt" | "likes" | "comments">;
