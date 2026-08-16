import { CartProvider } from "@/lib/cartStore";
import { CatalogProvider } from "@/lib/CatalogProvider";
import { AuthProvider } from "@/lib/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastHost } from "@/components/Toast";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CatalogProvider>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastHost />
        </CartProvider>
      </AuthProvider>
    </CatalogProvider>
  );
}
