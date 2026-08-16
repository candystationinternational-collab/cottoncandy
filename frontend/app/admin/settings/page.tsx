"use client";

import { useEffect, useState } from "react";
import { adminApi, type DeliveryZoneWrite } from "@/lib/adminApi";
import { formatPrice } from "@/lib/CatalogProvider";
import type { Settings, DeliveryZone } from "@/lib/apiClient";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [newZone, setNewZone] = useState<DeliveryZoneWrite>({ name: "", description: "", cost: 0, enabled: true });
  const [saved, setSaved] = useState(false);

  function load() {
    Promise.all([adminApi.getSettings(), adminApi.getDeliveryZones()]).then(([s, z]) => {
      setSettings(s);
      setZones(z);
    });
  }
  useEffect(load, []);

  async function saveSettings() {
    if (!settings) return;
    await adminApi.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addZone() {
    if (!newZone.name.trim()) return;
    await adminApi.createDeliveryZone(newZone);
    setNewZone({ name: "", description: "", cost: 0, enabled: true });
    load();
  }

  async function updateZone(z: DeliveryZone) {
    await adminApi.updateDeliveryZone(z.id, { name: z.name, description: z.description, cost: z.cost, enabled: z.enabled });
    load();
  }

  async function removeZone(id: number) {
    if (!confirm("Delete this delivery zone?")) return;
    await adminApi.deleteDeliveryZone(id);
    load();
  }

  if (!settings) return <p className="text-navy/50">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-extrabold text-navy">Settings</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">Store Info</h2>
          <div className="space-y-3">
            <Field label="Store Name" value={settings.storeName} onChange={(v) => setSettings({ ...settings, storeName: v })} />
            <Field label="Address" value={settings.storeAddress ?? ""} onChange={(v) => setSettings({ ...settings, storeAddress: v })} />
            <Field label="Phone" value={settings.storePhone ?? ""} onChange={(v) => setSettings({ ...settings, storePhone: v })} />
            <Field label="Email" value={settings.storeEmail ?? ""} onChange={(v) => setSettings({ ...settings, storeEmail: v })} />
            <Field label="Hours" value={settings.storeHours ?? ""} onChange={(v) => setSettings({ ...settings, storeHours: v })} />
            <Field label="Pickup Address" value={settings.pickupAddress ?? ""} onChange={(v) => setSettings({ ...settings, pickupAddress: v })} />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-navy">COD &amp; Tax</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="h-4 w-4 accent-pink"
              />
              Cash on Delivery enabled
            </label>
            <Field
              label="COD Min Order (Rs.)"
              type="number"
              value={String(settings.codMinOrder)}
              onChange={(v) => setSettings({ ...settings, codMinOrder: Number(v) })}
            />
            <Field
              label="COD Max Order (Rs.)"
              type="number"
              value={String(settings.codMaxOrder)}
              onChange={(v) => setSettings({ ...settings, codMaxOrder: Number(v) })}
            />
            <Field
              label="Tax Rate (%)"
              type="number"
              value={String(settings.taxRate)}
              onChange={(v) => setSettings({ ...settings, taxRate: Number(v) })}
            />
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">COD Instructions</label>
              <textarea
                value={settings.codInstructions ?? ""}
                onChange={(e) => setSettings({ ...settings, codInstructions: e.target.value })}
                rows={2}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">Shipping Policy</label>
              <textarea
                value={settings.shippingPolicy ?? ""}
                onChange={(e) => setSettings({ ...settings, shippingPolicy: e.target.value })}
                rows={2}
                className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <button onClick={saveSettings} className="mt-4 rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white">
        {saved ? "Saved ✓" : "Save Settings"}
      </button>

      <div className="mt-8 rounded-2xl border-2 border-navy/10 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Delivery Zones</h2>
        <div className="space-y-3">
          {zones.map((z) => (
            <div key={z.id} className="grid grid-cols-[1fr_1fr_120px_80px_auto] items-center gap-2">
              <input
                value={z.name}
                onChange={(e) => setZones(zones.map((x) => (x.id === z.id ? { ...x, name: e.target.value } : x)))}
                className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
              />
              <input
                value={z.description ?? ""}
                onChange={(e) => setZones(zones.map((x) => (x.id === z.id ? { ...x, description: e.target.value } : x)))}
                className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={z.cost}
                onChange={(e) => setZones(zones.map((x) => (x.id === z.id ? { ...x, cost: Number(e.target.value) } : x)))}
                className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
              />
              <span className="text-xs text-navy/50">{formatPrice(z.cost)}</span>
              <div className="flex gap-2">
                <button onClick={() => updateZone(z)} className="text-xs font-bold text-navy hover:text-pink">
                  Save
                </button>
                <button onClick={() => removeZone(z.id)} className="text-xs font-bold text-pink">
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-[1fr_1fr_120px_80px_auto] items-center gap-2 border-t-2 border-dashed border-navy/10 pt-3">
            <input
              placeholder="Zone name"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
            />
            <input
              placeholder="Description"
              value={newZone.description ?? ""}
              onChange={(e) => setNewZone({ ...newZone, description: e.target.value })}
              className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Cost"
              value={newZone.cost}
              onChange={(e) => setNewZone({ ...newZone, cost: Number(e.target.value) })}
              className="rounded-lg border-2 border-navy/20 px-3 py-2 text-sm"
            />
            <span />
            <button onClick={addZone} className="text-xs font-bold text-pink">
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-navy/20 px-4 py-2.5 text-sm focus:border-pink focus:outline-none"
      />
    </div>
  );
}
