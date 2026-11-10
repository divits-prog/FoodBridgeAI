-- Update Food Paradise with realistic image
UPDATE restaurants SET 
    image_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    rating = 4.7
WHERE id = 4;

-- Update existing 4 dishes with high-res photos
UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category = 'Biryani'
WHERE id = 6;

UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    category = 'Main Course'
WHERE id = 7;

UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    category = 'Biryani'
WHERE id = 8;

UPDATE foods SET 
    food_name = 'Woodfired Margherita Pizza',
    description = 'Hand-stretched sourdough crust with San Marzano tomatoes, fresh mozzarella & sweet basil',
    image_url = 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    category = 'Pizza'
WHERE id = 9;

-- Add new restaurant 1: The Rustic Oven (Italian / Bakery)
INSERT INTO restaurants (restaurant_name, owner_name, email, phone, address, city, rating, image_url)
SELECT 'The Rustic Oven', 'Marco Bellini', 'contact@rusticoven.com', '9876543211', '14 Heritage Boulevard', 'Coimbatore', 4.8, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE restaurant_name = 'The Rustic Oven');

-- Add new restaurant 2: Green Haven Kitchen (Salads & Healthy)
INSERT INTO restaurants (restaurant_name, owner_name, email, phone, address, city, rating, image_url)
SELECT 'Green Haven Kitchen', 'Sarah Chen', 'hello@greenhaven.org', '9876543212', '82 Riverbed Lane', 'Coimbatore', 4.9, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE restaurant_name = 'Green Haven Kitchen');

-- Add new restaurant 3: Sweet Bridges Patisserie (Desserts)
INSERT INTO restaurants (restaurant_name, owner_name, email, phone, address, city, rating, image_url)
SELECT 'Sweet Bridges Patisserie', 'Elena Rostova', 'orders@sweetbridges.com', '9876543213', '5 Flower Market Cross', 'Coimbatore', 4.8, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE restaurant_name = 'Sweet Bridges Patisserie');

-- Add dishes for The Rustic Oven
INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Truffle Mushroom Fettuccine', 'Handmade egg fettuccine tossed in white truffle butter, wild mushrooms & aged parmesan', 220, 'Italian', 1, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281728?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'The Rustic Oven'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Truffle Mushroom Fettuccine');

INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Garlic Herb Focaccia', 'Golden olive oil focaccia baked with rosemary, roasted garlic cloves and flaky sea salt', 95, 'Appetizer', 1, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'The Rustic Oven'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Garlic Herb Focaccia');

-- Add dishes for Green Haven Kitchen
INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Avocado Green Goddess Bowl', 'Organic avocado, tri-color quinoa, roasted chickpeas, kale and tangy tahini lemon drizzle', 150, 'Healthy', 1, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'Green Haven Kitchen'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Avocado Green Goddess Bowl');

INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Acai Berry Energy Smoothie', 'Chilled acai blended with almond milk, fresh blueberries, chia seeds & toasted coconut', 120, 'Beverage', 1, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'Green Haven Kitchen'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Acai Berry Energy Smoothie');

-- Add dishes for Sweet Bridges Patisserie
INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Belgian Molten Chocolate Cake', 'Warm dark chocolate fondant with a luscious molten core, dusted with Dutch cocoa', 140, 'Dessert', 1, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'Sweet Bridges Patisserie'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Belgian Molten Chocolate Cake');

INSERT INTO foods (food_name, description, price, category, available, image_url, restaurant_id)
SELECT 'Golden Butter Croissant', 'Flaky, 72-layer European butter croissant baked crisp every morning', 75, 'Dessert', 1, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', r.id
FROM restaurants r WHERE r.restaurant_name = 'Sweet Bridges Patisserie'
AND NOT EXISTS (SELECT 1 FROM foods WHERE food_name = 'Golden Butter Croissant');
