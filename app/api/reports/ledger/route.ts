import { NextRequest } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api';
import { getWorkspace } from '@/lib/workspace';
import { getReportDataset } from '@/lib/reports';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { organization } = await getWorkspace();
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from') as string) : undefined;
    const to = url.searchParams.get('to') ? new Date(url.searchParams.get('to') as string) : undefined;
    const report = await getReportDataset(organization.id, from, to);
    return successResponse({ ledger: report.ledger, summary: report.summary });
  } catch (error) {
    return errorResponse(error);
  }
}