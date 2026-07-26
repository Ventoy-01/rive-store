import NavbarWrapper from '@/app/components/NavbarWrapper';
import Footer from '@/app/components/Footer';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarWrapper />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}