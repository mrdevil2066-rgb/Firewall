// Fake seed data for the target victim website
// This data simulates a real e-commerce database

const users = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@shopvictim.com', role: 'admin', address: '123 Admin St, NY', creditCard: '4111-1111-1111-1111', balance: 9999.99 },
    { id: 2, username: 'john_doe', password: 'john1234', email: 'john@gmail.com', role: 'user', address: '456 Elm St, LA', creditCard: '4222-2222-2222-2222', balance: 250.00 },
    { id: 3, username: 'alice_smith', password: 'alice2024', email: 'alice@yahoo.com', role: 'user', address: '789 Oak Ave, Chicago',  creditCard: '4333-3333-3333-3333', balance: 1350.50 },
    { id: 4, username: 'bob_jones', password: 'bob@pass', email: 'bob@hotmail.com', role: 'user', address: '321 Pine Rd, Houston', creditCard: '4444-4444-4444-4444', balance: 780.00 },
    { id: 5, username: 'sarah_k', password: 'sarah!2023', email: 'sarah@outlook.com', role: 'moderator', address: '654 Maple Dr, Phoenix', creditCard: '4555-5555-5555-5555', balance: 3200.00 },
    { id: 6, username: 'mike_98', password: 'mike_pass', email: 'mike@gmail.com', role: 'user', address: '987 Cedar Ln, Philadelphia', creditCard: '4666-6666-6666-6666', balance: 125.75 },
];

const products = [
    { id: 1, name: 'Gaming Laptop Pro', price: 1499.99, stock: 15, category: 'Electronics', description: 'High-performance gaming laptop with RTX 4080' },
    { id: 2, name: 'Wireless Headphones', price: 299.99, stock: 48, category: 'Electronics', description: 'Noise-cancelling premium wireless headphones' },
    { id: 3, name: 'Smart Watch Ultra', price: 549.99, stock: 23, category: 'Wearables', description: 'Advanced smartwatch with health monitoring' },
    { id: 4, name: 'Running Shoes X400', price: 119.99, stock: 95, category: 'Footwear', description: 'Lightweight performance running shoes' },
    { id: 5, name: 'Coffee Maker Deluxe', price: 79.99, stock: 60, category: 'Kitchen', description: 'Programmable 12-cup coffee maker' },
    { id: 6, name: '4K Monitor 27"', price: 399.99, stock: 30, category: 'Electronics', description: 'Professional 4K IPS display for productivity' },
    { id: 7, name: 'Mechanical Keyboard', price: 149.99, stock: 55, category: 'Peripherals', description: 'RGB mechanical gaming keyboard' },
    { id: 8, name: 'Yoga Mat Premium', price: 49.99, stock: 120, category: 'Fitness', description: 'Non-slip premium yoga mat with carrying strap' },
];

const blogPosts = [
    { id: 1, title: 'Top 10 Tech Deals of the Month', author: 'admin', content: 'Check out our amazing deals on electronics this month! We have the best prices on laptops, phones, and accessories.', date: '2024-01-15', views: 1523 },
    { id: 2, title: 'New Product Launch: Smart Watch Ultra', author: 'alice_smith', content: 'We are thrilled to announce our latest wearable technology. The Smart Watch Ultra comes with advanced health monitoring features.', date: '2024-01-20', views: 892 },
    { id: 3, title: 'Customer Satisfaction at 98%!', author: 'admin', content: 'We are proud to announce that our customer satisfaction rating has reached 98%! Thank you for your continued support.', date: '2024-01-25', views: 654 },
];

const orders = [
    { id: 1001, userId: 2, username: 'john_doe', product: 'Gaming Laptop Pro', amount: 1499.99, status: 'Delivered', date: '2024-01-10' },
    { id: 1002, userId: 3, username: 'alice_smith', product: 'Smart Watch Ultra', amount: 549.99, status: 'Shipped', date: '2024-01-18' },
    { id: 1003, userId: 4, username: 'bob_jones', product: 'Wireless Headphones', amount: 299.99, status: 'Processing', date: '2024-01-22' },
    { id: 1004, userId: 6, username: 'mike_98', product: 'Running Shoes X400', amount: 119.99, status: 'Delivered', date: '2024-01-08' },
];

// Runtime state (mutable during attacks)
let comments = [
    { id: 1, author: 'john_doe', content: 'Great products! Love the gaming laptop.', date: '2024-01-12', safe: true },
    { id: 2, author: 'alice_smith', content: 'Fast shipping, will buy again!', date: '2024-01-19', safe: true },
];

let loginAttempts = {}; // Track login attempts per username
let lockedAccounts = {}; // Track locked accounts
let requestLog = []; // Track recent requests for DDoS detection
let ddosMode = false; // DDoS overwhelm state
let ddosResetTimer = null;

module.exports = {
    users,
    products,
    blogPosts,
    orders,
    comments,
    loginAttempts,
    lockedAccounts,
    requestLog,
    get ddosMode() { return ddosMode; },
    set ddosMode(val) { ddosMode = val; },
    get ddosResetTimer() { return ddosResetTimer; },
    set ddosResetTimer(val) { ddosResetTimer = val; },
    resetState() {
        comments.length = 0;
        comments.push(
            { id: 1, author: 'john_doe', content: 'Great products! Love the gaming laptop.', date: '2024-01-12', safe: true },
            { id: 2, author: 'alice_smith', content: 'Fast shipping, will buy again!', date: '2024-01-19', safe: true }
        );
        Object.keys(loginAttempts).forEach(k => delete loginAttempts[k]);
        Object.keys(lockedAccounts).forEach(k => delete lockedAccounts[k]);
        requestLog.length = 0;
        ddosMode = false;
    }
};
