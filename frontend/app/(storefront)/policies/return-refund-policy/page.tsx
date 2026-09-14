"use client";

import { useCatalog } from "@/lib/CatalogProvider";
import { PolicyPage } from "@/components/PolicyPage";

export default function ReturnRefundPolicyPage() {
  const { settings } = useCatalog();
  return <PolicyPage title="Return & Refund Policy" content={settings?.returnRefundPolicy} />;
}
