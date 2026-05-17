'use client';

import { useState } from 'react';
import { Header, YearsBar, Sidebar, PageLoader } from "@/components/layout";
import { X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:block sticky top-0 h-screen overflow-y-auto pt-8 px-4 border-r border-zinc-900 flex-shrink-0">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold uppercase tracking-tighter text-zinc-100">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-100">
                <X size={20} />
              </button>
            </div>
            <Sidebar onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-50 flex flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <YearsBar />
        </div>
        <main className="flex-1 px-4 md:px-8 pb-10 pt-4 md:pt-8 min-w-0">
          <PageLoader>{children}</PageLoader>
        </main>
      </div>
    </div>
  );
}
