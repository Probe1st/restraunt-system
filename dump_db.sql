    -- Создание перечислений
CREATE TYPE user_role AS ENUM ('admin', 'waiter', 'chef');
CREATE TYPE order_status AS ENUM ('received', 'preparing', 'ready', 'paid');

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
	last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для хранения refresh-токенов
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);

-- Таблица смен
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

-- Таблица назначений на смены
CREATE TABLE shift_assignments (
    shift_id INT REFERENCES shifts(id),
    user_id INT REFERENCES users(id),
    PRIMARY KEY (shift_id, user_id)
);

-- Таблица столиков
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0)
);

-- Таблица пунктов меню
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    is_available BOOLEAN DEFAULT TRUE,
    item_type VARCHAR(50) NOT NULL
);

-- Таблица заказов
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id),
    waiter_id INT REFERENCES users(id),
    customers_count INT NOT NULL CHECK (customers_count > 0),
    status order_status DEFAULT 'received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица элементов заказа
CREATE TABLE order_items (
    order_id INT REFERENCES orders(id),
    menu_item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, menu_item_id)
);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ---------------------------------------------------------------------

-- Добавление пользователей с bcrypt хэшами (пароль для всех 'password123')
INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', '0d45e19766c0cadfe3af48b801102a9de4337ee41088e3561d9f1e9897aeeeae', 'Иванов Иван Иванович', 'admin'),
('waiter1', '0d45e19766c0cadfe3af48b801102a9de4337ee41088e3561d9f1e9897aeeeae', 'Петрова Анна Сергеевна', 'waiter'),
('chef1', '0d45e19766c0cadfe3af48b801102a9de4337ee41088e3561d9f1e9897aeeeae', 'Сидоров Алексей Владимирович', 'chef');

-- Добавление столиков
INSERT INTO tables (table_number, capacity) VALUES
(1, 4),
(2, 6),
(3, 2);

-- Добавление пунктов меню
INSERT INTO menu_items (name, description, price, item_type) VALUES
('Стейк', 'Говяжий стейк средней прожарки', 1200.00, 'main'),
('Салат Цезарь', 'Классический салат с курицей', 450.00, 'starter'),
('Кофе', 'Арабика 200 мл', 250.00, 'drink');

-- Добавление смены
INSERT INTO shifts (start_time, end_time) VALUES
('2024-03-01 09:00:00', '2024-03-01 21:00:00');

-- Назначение на смену
INSERT INTO shift_assignments (shift_id, user_id) VALUES
(1, 2),  -- Официант
(1, 3);  -- Повар

-- Создание заказа
INSERT INTO orders (table_id, waiter_id, customers_count) VALUES
(1, 2, 3);

-- Добавление блюд в заказ
INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 3, 3);