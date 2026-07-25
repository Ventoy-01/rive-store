import ProductForm from '@/app/admin/components/ProductForm';

export default function NewProductPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-serif text-gray-800">
                    Ajouter un produit
                </h1>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ProductForm />
            </div>
        </div>
    );
}