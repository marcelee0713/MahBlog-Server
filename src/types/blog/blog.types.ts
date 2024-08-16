export const BlogStatusArr = ["ACTIVE", "FLAGGED"] as const;

export const BlogVisibilityArr = ["PRIVATE", "PUBLIC", "DRAFTED"] as const;

export const BlogSortingOptionsArr = ["BEST", "CONTROVERSIAL", "LATEST", "OLDEST"] as const;

export type BlogSortingOptions = (typeof BlogSortingOptionsArr)[number];

export type BlogStatus = (typeof BlogStatusArr)[number];

export type BlogVisibility = (typeof BlogVisibilityArr)[number];
