import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  error: string,
  code: string,
  status = 400,
  details?: Record<string, string>
) {
  return NextResponse.json({ error, code, details }, { status });
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
) {
  return NextResponse.json({
    data,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    },
  });
}
