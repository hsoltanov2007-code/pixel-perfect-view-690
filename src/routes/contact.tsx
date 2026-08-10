import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  component: ContactLayout,
});

function ContactLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <main className="relative z-10 mx-auto min-h-screen max-w-7xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
