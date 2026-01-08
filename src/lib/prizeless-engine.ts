import OpenAI from 'openai';

export interface Product {
    id: number | string;
    name: string;
    price: number;
    shop: string;
    product_link: string;
    image_url?: string;
    category?: string;
    description?: string;
}

const PRODUCTS_API_URL = '/api/prizeless/products/all';
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'mock-1',
        name: 'iPhone 15 Pro',
        price: 1200000,
        shop: 'Nova Store',
        product_link: '#',
        category: 'phones',
        description: 'Latest iPhone with Titanium design'
    },
    {
        id: 'mock-2',
        name: 'HP Pavilion Laptop',
        price: 450000,
        shop: 'Nova Store',
        product_link: '#',
        category: 'laptops',
        description: 'Powerful laptop for everyday use'
    },
    {
        id: 'mock-3',
        name: 'Logitech Wireless Mouse',
        price: 15000,
        shop: 'Nova Store',
        product_link: '#',
        category: 'accessories',
        description: 'Comfortable wireless mouse'
    }
];

export async function fetchAllProducts(): Promise<Product[]> {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            console.warn(`API Fetch Warning: ${response.status} ${response.statusText}. Using fallback data.`);
            return MOCK_PRODUCTS;
        }
        const responseData = await response.json();
        const data = responseData.data || [];

        if (data.length === 0) return MOCK_PRODUCTS;

        const flattenedProducts: Product[] = [];

        data.forEach((item: any) => {
            const listings = item.listings || [];
            listings.forEach((listing: any) => {
                flattenedProducts.push({
                    id: listing._id || item._id,
                    name: item.title || 'Unknown Product',
                    price: listing.price || 0,
                    shop: listing.store || 'Unknown Store',
                    product_link: listing.product_url || '#',
                    image_url: listing.image_url,
                    category: item.category,
                    description: item.description || item.spec_category
                });
            });
        });

        return flattenedProducts;
    } catch (error) {
        console.error('Error fetching products, using mock fallback:', error);
        return MOCK_PRODUCTS;
    }
}

export function findRelevantProducts(query: string, products: Product[]): Product[] {
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length >= 2);
    if (keywords.length === 0) return [];

    return products.filter(product => {
        const productName = (product.name || '').toLowerCase();
        const productCategory = (product.category || '').toLowerCase();
        const productShop = (product.shop || '').toLowerCase();
        return keywords.some(keyword =>
            productName.includes(keyword) ||
            productCategory.includes(keyword) ||
            productShop.includes(keyword)
        );
    });
}


export function filterGifts(interests: string, maxPrice: number, products: Product[]): Product[] {
    const keywords = interests.toLowerCase().split(',').map(s => s.trim());
    return products.filter(p => {
        const matchesInterest = keywords.some(k =>
            (p.name || '').toLowerCase().includes(k) ||
            (p.category || '').toLowerCase().includes(k) ||
            (p.description || '').toLowerCase().includes(k)
        );
        return matchesInterest && p.price <= maxPrice;
    }).slice(0, 10);
}
