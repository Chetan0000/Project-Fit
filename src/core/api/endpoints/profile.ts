import { request } from "@/core/api/client";
import { clone, mockStore } from "@/core/api/mocks";
import type { Profile } from "@/core/api/types";
import { USE_MOCKS } from "@/core/config/env";

export async function getProfile(): Promise<Profile> {
  if (!USE_MOCKS) return request<Profile>("/profile");
  return clone(mockStore.profile);
}

export async function updateProfile(patch: Partial<Profile>): Promise<Profile> {
  if (!USE_MOCKS) {
    return request<Profile>("/profile", { method: "PATCH", body: patch });
  }
  mockStore.profile = { ...mockStore.profile, ...patch };
  return clone(mockStore.profile);
}
