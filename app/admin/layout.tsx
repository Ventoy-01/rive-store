'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar />
            </div>

            <div className="lg:pl-72">
                <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-serif text-primary-700">RiveStore Admin</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}