'use client';

import { Header, YearsBar, Sidebar, PageLoader } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <YearsBar />
      <div className="flex-1 flex gap-8 px-8 pb-10 pt-40 w-full">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <PageLoader>{children}</PageLoader>
        </main>
      </div>
    </>
  );
}
