import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SpendForm from "@/components/audit/spend-form";

export const metadata = {
  title: "Spend Audit Questionnaire — TokenSpend.ai",
  description: "Input your model token APIs, developer seats, and compute costs to run an automated FinOps spend audit."
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col selection:bg-primary/30">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Spend Auditor
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Provide details of your token volumes, employee licenses, and server billing. All data is processed client-side and saved securely.
          </p>
        </div>

        <SpendForm />
      </main>

      <Footer />
    </div>
  );
}
