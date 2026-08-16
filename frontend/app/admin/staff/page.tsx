"use client";

import { useEffect, useState } from "react";
import { adminApi, type StaffUser } from "@/lib/adminApi";

const EMPTY = { username: "", password: "", displayName: "", role: "Delivery" };

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [resetTargetId, setResetTargetId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  function load() {
    adminApi.getStaff().then(setStaff);
  }
  useEffect(load, []);

  async function createStaff() {
    setError("");
    try {
      await adminApi.createStaff(form);
      setForm(EMPTY);
      setShowNew(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create staff account.");
    }
  }

  async function toggleActive(u: StaffUser) {
    await adminApi.updateStaff(u.id, { displayName: u.displayName ?? "", role: u.role, isActive: !u.isActive });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this staff account?")) return;
    await adminApi.deleteStaff(id);
    load();
  }

  async function resetPassword() {
    if (!resetTargetId) return;
    await adminApi.resetStaffPassword(resetTargetId, newPassword);
    setResetTargetId(null);
    setNewPassword("");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-navy">Staff Users</h1>
        <button onClick={() => setShowNew(true)} className="rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-pink">
          + Add Staff
        </button>
      </div>
      <p className="mb-4 text-sm text-navy/60">
        Admin accounts have full access. Delivery accounts can only view orders, update delivery status, and print delivery notes/invoices — no edit rights elsewhere.
      </p>

      <div className="overflow-x-auto rounded-2xl border-2 border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-navy/70">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Display Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((u) => (
              <tr key={u.id} className="border-t border-navy/10">
                <td className="px-4 py-3 font-semibold text-navy">{u.username}</td>
                <td className="px-4 py-3 text-navy/70">{u.displayName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${u.role === "Admin" ? "bg-purple" : "bg-cyan"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(u)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${u.isActive ? "bg-lime text-white" : "bg-navy/10 text-navy/50"}`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setResetTargetId(u.id)} className="mr-3 text-xs font-bold text-navy hover:text-pink">
                    Reset Password
                  </button>
                  <button onClick={() => remove(u.id)} className="text-xs font-bold text-pink">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">Add Staff Account</h2>
            {error && <p className="mb-4 rounded-xl border-2 border-pink bg-pink/5 p-3 text-sm text-pink">{error}</p>}
            <div className="space-y-3">
              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              />
              <input
                placeholder="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              >
                <option value="Delivery">Delivery (rider)</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowNew(false)} className="rounded-full border-2 border-navy px-5 py-2.5 text-sm font-bold text-navy">
                Cancel
              </button>
              <button onClick={createStaff} className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {resetTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-navy">Reset Password</h2>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setResetTargetId(null)} className="rounded-full border-2 border-navy px-5 py-2.5 text-sm font-bold text-navy">
                Cancel
              </button>
              <button onClick={resetPassword} className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
