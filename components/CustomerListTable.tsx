'use client'

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type Customer = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
};

type CustomerListTableProps = {
  customers: Customer[];
};

export function CustomerListTable({ customers }: CustomerListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Søk etter kunde (navn, e-post, telefon)..."
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Telefonnummer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  {searchQuery ? "Ingen kunder matcher søket" : "Ingen kunder funnet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, idx) => (
                <TableRow key={`${customer.email}-${idx}`}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        {searchQuery && filteredCustomers.length !== customers.length ? (
          <>
            Viser {filteredCustomers.length} av {customers.length} kunde
            {customers.length !== 1 ? "r" : ""}
          </>
        ) : (
          <>
            Viser {customers.length} kunde{customers.length !== 1 ? "r" : ""}
          </>
        )}
      </div>
    </div>
  );
}

