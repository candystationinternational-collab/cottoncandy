export const STATUS_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Admin list/detail endpoints return the C# enum name (PascalCase, e.g. "OutForDelivery")
// rather than the customer-facing wire format (snake_case, e.g. "out_for_delivery").
const PASCAL_TO_LABEL: Record<string, string> = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Preparing: "Preparing",
  OutForDelivery: "Out for Delivery",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

export function labelForStatus(status: string): string {
  return STATUS_LABELS[status] ?? PASCAL_TO_LABEL[status] ?? status;
}
