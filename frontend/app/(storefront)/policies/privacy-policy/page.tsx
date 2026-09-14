"use client";

import { useCatalog } from "@/lib/CatalogProvider";
import { PolicyPage } from "@/components/PolicyPage";

export default function PrivacyPolicyPage() {
  const { settings } = useCatalog();
  return <PolicyPage title="Privacy Policy" content={settings?.privacyPolicy} />;
}
