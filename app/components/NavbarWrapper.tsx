'use client';

import { Suspense } from 'react';
import Navbar from './Navbar';

export default function NavbarWrapper() {
    return (
        <Suspense fallback={<div className="h-16 bg-white/90 backdrop-blur-md border-b-2 border-primary-500"></div>}>
            <Navbar />
        </Suspense>
    );
}