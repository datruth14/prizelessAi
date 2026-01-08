'use server';

import OpenAI from 'openai';
import { Product, findRelevantProducts, filterGifts } from './prizeless-engine';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getBudgetOptimization(
    budget: number,
    shoppingList: string,
    allProducts: Product[]
) {
    let relevantProducts = findRelevantProducts(shoppingList, allProducts);

    // Fallback: If no relevant products found, give the AI a sample of the catalog
    // so it can tell the user what IS available or suggest alternatives.
    if (relevantProducts.length === 0) {
        relevantProducts = allProducts.slice(0, 20);
    }

    // Limit the context
    const contextProducts = relevantProducts.slice(0, 50).map(p => ({
        name: p.name,
        price: p.price,
        shop: p.shop,
        link: p.product_link,
        image: p.image_url
    }));

    const systemPrompt = `
    You are a "Nigerian Market Expert" shopping assistant. 
    Your goal is to help users stay under their budget while getting the best value for their shopping list based ONLY on the provided products.
    
    CRITICAL: The "total_cost" MUST NOT EXCEED ₦${budget.toLocaleString()}. 
    If the shopping list items exceed the budget, you MUST prioritize the most essential items or suggest fewer items to stay within ₦${budget.toLocaleString()}.
    
    Budget: ₦${budget.toLocaleString()}
    User's Shopping List: ${shoppingList}
    
    Available Products (Context):
    ${JSON.stringify(contextProducts)}
    
    Instructions:
    1. Analyze the shopping list and find the best combination of items from the provided context.
    2. YOU MUST ONLY USE PRODUCTS FROM THE PROVIDED CONTEXT. DO NOT MAKE UP PRODUCTS.
    3. YOU MUST USE THE EXACT "link", "image", and "shop" PROVIDED IN THE CONTEXT for each recommendation.
    4. If an exact item isn't available, suggest the closest alternative from the context.
    5. Calculate the total cost and ensure it's strictly <= ₦${budget.toLocaleString()}.
    6. Provide the result in a clean JSON format:
       {
         "recommendations": [
           { "name": "...", "price": 0, "shop": "...", "link": "...", "image": "...", "reason": "..." }
         ],
         "total_cost": 0,
         "remaining_budget": 0,
         "summary": "..."
       }
    7. Act as a Market Intelligence expert: list specific prices and compare vendors to find the absolute most cost-effective deal.
    8. Be witty and helpful, like a seasoned trader in Balogun or Ariaria market.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Please optimize my shopping list: ${shoppingList}` }
            ],
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        // Programmatic Safety Net: Ensure total doesn't exceed budget
        if (result.recommendations) {
            let total = 0;
            const validRecs = [];
            for (const item of result.recommendations) {
                const price = Number(item.price) || 0;
                if (total + price <= budget) {
                    total += price;
                    validRecs.push(item);
                }
            }
            result.recommendations = validRecs;
            result.total_cost = total;
            result.remaining_budget = budget - total;
        }

        return result;
    } catch (error) {
        console.error('Error during budget optimization:', error);
        return { error: 'Failed to optimize budget.' };
    }
}

export async function getGiftRecommendations(
    interests: string,
    budget: number,
    allProducts: Product[]
) {
    // Better interest splitting and searching (uses description field too)
    let candidates = filterGifts(interests, budget, allProducts);

    // Fallback: Use some general products if no direct match
    if (candidates.length === 0) {
        candidates = allProducts.slice(0, 20);
    }

    // Provide a mix of candidates and some other relevant items if necessary
    const contextProducts = candidates.map(p => ({
        name: p.name,
        price: p.price,
        shop: p.shop,
        link: p.product_link,
        image: p.image_url
    }));

    const systemPrompt = `
    You are a "Nigerian Market Expert" gift personal shopper. 
    Your goal is to find the perfect gifts based on the recipient's interests while staying strictly under the budget and using ONLY the provided products.
    
    CRITICAL: The total price of suggested gifts (if multiple are suggested as a set) or each individual choice MUST NOT EXCEED ₦${budget.toLocaleString()}. 
    NEVER recommend anything that would cause the user to overspend their ₦${budget.toLocaleString()}.
    
    Budget: ₦${budget.toLocaleString()}
    Recipient Interests: ${interests}
    
    Available Products (Context):
    ${JSON.stringify(contextProducts)}
    
    Instructions:
    1. Select the most relevant products from the context that match the recipient's interests.
    2. YOU MUST ONLY USE PRODUCTS FROM THE PROVIDED CONTEXT. DO NOT MAKE UP PRODUCTS.
    3. Curate a list of 3-5 unique gift options.
    4. For each gift, explain why it's a great choice for someone interested in ${interests}.
    5. YOU MUST USE THE EXACT "link", "image", and "shop" PROVIDED IN THE CONTEXT for each product.
    6. Ensure the total cost (if they bought all or suggested sets) stays within the budget of ₦${budget.toLocaleString()}.
    7. Provide the result in a clean JSON format:
       {
         "recommendations": [
           { "name": "...", "price": 0, "shop": "...", "link": "...", "image": "...", "reason": "..." }
         ],
         "total_cost": 0,
         "remaining_budget": 0,
         "summary": "..."
       }
    8. Act as a Personal Market Shopper: Compare available vendors and prices to find the best gift deal.
    9. Maintain a helpful, savvy "market expert" persona (friendly and persuasive).
  `;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Find me the best gifts for someone interested in: ${interests}` }
            ],
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        // Programmatic Safety Net: Ensure total doesn't exceed budget
        if (result.recommendations) {
            let total = 0;
            const validRecs = [];
            for (const item of result.recommendations) {
                const price = Number(item.price) || 0;
                if (total + price <= budget) {
                    total += price;
                    validRecs.push(item);
                }
            }
            result.recommendations = validRecs;
            result.total_cost = total;
            result.remaining_budget = budget - total;
        }

        return result;
    } catch (error) {
        console.error('Error during gift recommendation:', error);
        return { error: 'Failed to find gift recommendations.' };
    }
}
