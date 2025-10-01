'use client'

import { SellerTicketsTable } from "@/components/SellerTicketsTable";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type SellerTicketsTableWrapperProps = {
  data: React.ComponentProps<typeof SellerTicketsTable>["data"];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function SellerTicketsTableWrapper({
  data,
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: SellerTicketsTableWrapperProps) {
  const router = useRouter();

  const handlePageChange = useCallback(
    (nextPage: number) => {
      router.push(`/seller/tickets?page=${nextPage}`);
    },
    [router]
  );

  return (
    <SellerTicketsTable
      data={data}
      page={page}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      onPageChange={handlePageChange}
    />
  );
}
