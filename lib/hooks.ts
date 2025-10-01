'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useStorageUrl(storageId: Id<"_storage"> | string | undefined) {
  return useQuery(
    api.storage.getUrl, 
    storageId ? { storageId: storageId as Id<"_storage"> } : "skip"
  );
}
