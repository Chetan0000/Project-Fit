import { request } from "@/core/api/client";
import { clone, mockStore } from "@/core/api/mocks";
import type { SplitDay } from "@/core/api/types";
import { USE_MOCKS } from "@/core/config/env";

export async function getSplit(): Promise<SplitDay[]> {
  if (!USE_MOCKS) return request<SplitDay[]>("/split");
  return clone(mockStore.splitDays);
}

export async function saveSplit(days: SplitDay[]): Promise<SplitDay[]> {
  if (!USE_MOCKS) {
    return request<SplitDay[]>("/split", { method: "PUT", body: { days } });
  }
  mockStore.splitDays = clone(days);
  return clone(mockStore.splitDays);
}
