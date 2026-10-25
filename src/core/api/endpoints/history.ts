import { request } from "@/core/api/client";
import { buildProgressOverview } from "@/core/api/mocks";
import type { ProgressOverview } from "@/core/api/types";
import { USE_MOCKS } from "@/core/config/env";

export async function getProgressOverview(): Promise<ProgressOverview> {
  if (!USE_MOCKS) return request<ProgressOverview>("/progress");
  return buildProgressOverview();
}
