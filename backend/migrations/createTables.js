const { pool } = require("../config/database");

// SQL tạo các bảng đơn giản cho quán cafe nhỏ
const createTablesSQL = {
    // Bảng menu items (sản phẩm)
    menu_items: `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category ENUM('yaourt', 'milkTea', 'soda', 'fruitTea', 'topping','latte','food','coffee','milo-cacao','juice','bottleDrink', 'other') DEFAULT 'other',
      image_url VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng orders (đơn hàng) - chỉ có 2 trạng thái: chưa thanh toán và đã thanh toán
    orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      table_id INT NULL,
      customer_name VARCHAR(255),
      order_type ENUM('takeaway', 'dine_in') DEFAULT 'takeaway',
      payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
      notes TEXT,
      total DECIMAL(10,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME NULL,
      FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng order_details (chi tiết đơn hàng)
    order_details: `
    CREATE TABLE IF NOT EXISTS order_details (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      menu_item_id INT,
      quantity INT,
      price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng api_keys (xác thực đơn giản)
    api_keys: `
    CREATE TABLE IF NOT EXISTS api_keys (
      id INT AUTO_INCREMENT PRIMARY KEY,
      api_key VARCHAR(255) UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng tables (quản lý bàn)
    tables: `
    CREATE TABLE IF NOT EXISTS tables (
      id INT AUTO_INCREMENT PRIMARY KEY,
      table_name VARCHAR(50) NOT NULL UNIQUE,
      status ENUM('empty', 'occupied') DEFAULT 'empty',
      is_merged BOOLEAN DEFAULT FALSE,
      host_id INT NULL,
      merged_tables JSON NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (host_id) REFERENCES tables(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
};

// Dữ liệu mẫu đơn giản
const sampleData = {
    menu_items: `
    INSERT INTO menu_items (id, name, price, category, image_url) VALUES
    (1, 'Yaour Dâu',  20000, 'yaourt', 'https://beptruong.edu.vn/wp-content/uploads/2015/12/hinh-anh-yaourt-dau-tay-600x500.jpg'),
    (2, 'Trà sửa không thạch', 12000, 'milktea', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9lpkU4tO9olFPUOTDJSfrovzTXJWcGHAtVg&s'),
    (3, 'Soda dâu', 15000, 'coffee', 'https://daiichiramen.vn/wp-content/uploads/2023/09/Drink_4.jpg')
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price),
    category = VALUES(category),
    image_url = VALUES(image_url);
  `,

    tables: `
    INSERT INTO tables (id, table_name, status) VALUES
    (1, 'Bàn 01', 'empty'),
    (2, 'Bàn 02', 'empty'),
    (3, 'Bàn 03', 'empty'),
    (4, 'Bàn 04', 'empty'),    
    ON DUPLICATE KEY UPDATE
    table_name = VALUES(table_name),
    status = VALUES(status);
  `,
};

async function createTables() {
    const connection = await pool.getConnection();

    try {
        console.log("🔨 Bắt đầu tạo bảng database đơn giản...");

        // Tạo từng bảng theo thứ tự (quan trọng vì có foreign key)
        const tableOrder = ["menu_items", "tables", "orders", "order_details", "api_keys"];

        for (const tableName of tableOrder) {
            console.log(`📋 Tạo bảng: ${tableName}`);
            await connection.execute(createTablesSQL[tableName]);
            console.log(`✅ Bảng ${tableName} đã tạo thành công`);
        }

        console.log("🎯 Tất cả bảng đã được tạo thành công!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi tạo bảng:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function insertSampleData() {
    const connection = await pool.getConnection();

    try {
        console.log("📝 Bắt đầu thêm dữ liệu mẫu...");

        console.log(`📊 Thêm dữ liệu menu items`);
        await connection.execute(sampleData.menu_items);
        console.log(`✅ Dữ liệu menu items đã thêm thành công`);

        console.log(`📊 Thêm dữ liệu tables`);
        await connection.execute(sampleData.tables);
        console.log(`✅ Dữ liệu tables đã thêm thành công`);

        console.log("🎉 Tất cả dữ liệu mẫu đã được thêm!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi thêm dữ liệu mẫu:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function dropAllTables() {
    const connection = await pool.getConnection();

    try {
        console.log("🗑️ Xóa tất cả bảng...");

        // Tắt foreign key checks để có thể xóa bảng
        await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

        const tables = ["order_details", "orders", "tables", "menu_items", "api_keys"];

        for (const table of tables) {
            await connection.execute(`DROP TABLE IF EXISTS ${table}`);
            console.log(`✅ Đã xóa bảng: ${table}`);
        }

        // Bật lại foreign key checks
        await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

        console.log("🎯 Đã xóa tất cả bảng!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi xóa bảng:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createTables,
    insertSampleData,
    dropAllTables,
};
