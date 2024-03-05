import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export interface PaginationResult<T> {
  first: number;
  last: number;
  limit: number;
  total?: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.limit(options.limit).offset(offset).getMany();
  if (data.length > 0) {
    return {
      first: offset + 1,
      last: offset + data.length,
      limit: options.limit,
      total: options.total ? await qb.getCount() : null,
      totalPages: options.total
        ? Math.round((await qb.getCount()) / options.limit)
        : null,
      currentPage: options.currentPage,
      data,
    };
  }
  return {
    first: 0,
    last: 0,
    limit: 0,
    total: null,
    totalPages: null,
    currentPage: options.currentPage,
    data,
  };
}
