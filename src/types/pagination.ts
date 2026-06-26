export type PaginatedColumn = string[];

export type PaginatedPage = PaginatedColumn[];

export type PaginationResult = PaginatedPage[];

export interface PaginationOptions {
  columnCount?: number;
  blocks?: string[];
}
