export const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5005"
    : "https://ecom-rne9.onrender.com";

export const CATEGORIES = ["All", "Flash Light Crackers", "Deluxe Crackers", "Garalands", "Bijili Crackers", "Ground Chakkar", "Flower Pots", "Multi Colour Flower Pots", "Twinkling Star", "Bombs", "Candles", "Novelties", "Rockets", "Special Fountains", "Sparkless", "Fancy Items", "Fountain", "Aerial Fancy", "Repeating Multi Colour Function Shots"];

export const REVIEWS = [{
    name: "Priya S.",
    city: "Chennai",
    text: "Excellent quality from Ram Balaji Shop! The 25 Shot function box was absolutely stunning. Will order every Diwali!",
    rating: 5
}, {
    name: "Karthik R.",
    city: "Madurai",
    text: "I bought crackers from RamBalajiShop for the first time this year. The 1000 Wala garland was pure joy for the kids. Excellent service!",
    rating: 5
}, {
    name: "Ananya M.",
    city: "Coimbatore",
    text: "Best cracker shop online! Ram Balaji Agency's Flower Pots Deluxe was worth every rupee. Super fast WhatsApp support.",
    rating: 4
}, {
    name: "Arun K.",
    city: "Trichy",
    text: "Very authentic! The 120 Shot function box was mind-blowing! Highly recommended buying from Ram Balaji Shop.",
    rating: 5
}];

export const COMBOS = [{
    name: "Starter Pack",
    price: 499,
    mrp: 999,
    items: ["10 Cm Red Sparklers", "Ground Chakkar Big", "Flower Pots Small", "Red Bijili"],
    emoji: "🎆"
}, {
    name: "Family Celebration",
    price: 1299,
    mrp: 2599,
    items: ["30 Cm Red Sparklers", "Flower Pots Deluxe", "1000 Wala Garland", "King of King Bomb", "Peacock Fountain"],
    emoji: "🎁"
}, {
    name: "Grand Festival Box",
    price: 2999,
    mrp: 5999,
    items: ["120 Shot Function Box", "5000 Wala Garland", "Flower Pots Ashoka", "Tri Colour", "Thor Fountain", '3½" Fancy Aerial'],
    emoji: "🎊"
}];
