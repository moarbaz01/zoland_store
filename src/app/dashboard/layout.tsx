import Sidebar from "@/components/Dashboard/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <main className="flex-1">
        <Sidebar />
        {children}
      </main>
    </div>
  );
}
