"use client";

import { useEffect, useState } from "react";
import { adminApi, type CustomerAdmin } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  function load() {
    adminApi.getCustomers({ search: search || undefined, sort }).then(setCustomers);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `search` is intentionally read only on explicit Search click/Enter, not on every keystroke
  useEffect(load, [sort]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-navy">Customers</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search by name or email…"
          className="w-64 rounded-full border-2 border-navy/20 px-4 py-2 text-sm focus:border-pink focus:outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-semibold text-navy focus:border-pink focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="spent">Highest Spent</option>
          <option value="orders">Most Orders</option>
        </select>
        <button onClick={load} className="rounded-full bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-pink">
          Search
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-navy/70">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-navy/10">
                <td className="px-4 py-3 font-semibold text-navy">{c.name}</td>
                <td className="px-4 py-3 text-navy/70">{c.email}</td>
                <td className="px-4 py-3 text-navy/70">{c.phone}</td>
                <td className="px-4 py-3 text-navy/50">{new Date(c.joinedDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-bold text-pink">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy/50">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
