import { Expose } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }
  @Expose()
  first: number;
  @Expose()
  last: number;
  @Expose()
  limit: number;
  @Expose()
  total?: number;
  @Expose()
  totalPages: number;
  @Expose()
  currentPage: number;
  @Expose()
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
    return new PaginationResult({
      first: offset + 1,
      last: offset + data.length,
      limit: options.limit,
      total: options.total ? await qb.getCount() : null,
      totalPages: options.total
        ? Math.ceil((await qb.getCount()) / options.limit)
        : null,
      currentPage: options.currentPage,
      data,
    });
  }
  return new PaginationResult({
    first: 0,
    last: 0,
    limit: 0,
    total: null,
    totalPages: null,
    currentPage: options.currentPage,
    data,
  });
}
