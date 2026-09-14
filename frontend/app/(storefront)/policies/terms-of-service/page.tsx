"use client";

import { useCatalog } from "@/lib/CatalogProvider";
import { PolicyPage } from "@/components/PolicyPage";

export default function TermsOfServicePage() {
  const { settings } = useCatalog();
  return <PolicyPage title="Terms of Service" content={settings?.termsOfService} />;
}
