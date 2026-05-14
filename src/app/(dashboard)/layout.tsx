'use client';

import { Header, YearsBar, Sidebar, PageLoader } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 flex flex-col">
        <Header />
        <YearsBar />
      </div>
      <div className="flex-1 flex gap-8 px-8 pb-10 pt-8 w-full">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <PageLoader>{children}</PageLoader>
        </main>
      </div>
    </div>
  );
}
