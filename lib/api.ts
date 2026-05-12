import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function successResponse<T>(data: T, status = 200, meta?: ApiMeta) {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed.',
        issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status }
    );
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error';
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}