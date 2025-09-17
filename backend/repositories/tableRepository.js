const { pool } = require("../config/database");

class TableRepository {
    // Lấy tất cả bàn
    async getAllTables() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT * FROM tables 
                ORDER BY table_name ASC
            `);
            
            // Thêm role field để JSON gọn hơn
            return rows.map(table => ({
                ...table,
                merged_tables: table.merged_tables ? JSON.parse(table.merged_tables) : null,
                role: this.getTableRole(table)
            }));
        } finally {
            connection.release();
        }
    }
    
    // Helper method để xác định role của bàn
    getTableRole(table) {
        if (table.is_merged && !table.host_id) {
            return "HOST";
        } else if (!table.is_merged && table.host_id !== null) {
            return "CHILD";
        } else {
            return "NORMAL";
        }
    }

    // Lấy bàn theo ID
    async getTableById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM tables WHERE id = ?',
                [id]
            );
            
            const table = rows[0];
            if (!table) return null;
            
            return {
                ...table,
                merged_tables: table.merged_tables ? JSON.parse(table.merged_tables) : null,
                role: this.getTableRole(table)
            };
        } finally {
            connection.release();
        }
    }

    // Lấy bàn theo tên bàn
    async getTableByName(tableName) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM tables WHERE table_name = ?',
                [tableName]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    // Tạo bàn mới
    async createTable(tableData) {
        const connection = await pool.getConnection();
        try {
            const { table_name } = tableData;            
            const [result] = await connection.execute(
                'INSERT INTO tables (table_name) VALUES (?)',
                [table_name]
            );
            return await this.getTableById(result.insertId);
        } finally {
            connection.release();
        }
    }

    // Cập nhật thông tin bàn
    async updateTable(id, updates) {
        const connection = await pool.getConnection();
        try {
            const fields = [];
            const values = [];
            for (const [key, value] of Object.entries(updates)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
            values.push(id);
            const sql = `UPDATE tables SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            await connection.execute(sql, values);
            return await this.getTableById(id);
        } finally {
            connection.release();
        }
    }

    // Cập nhật trạng thái bàn
    async updateTableStatus(id, status) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'UPDATE tables SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, id]
            );
            return await this.getTableById(id);
        } finally {
            connection.release();
        }
    }

    // Gộp bàn
    async mergeTables(hostId, tableIds) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Tạo danh sách tất cả bàn (bao gồm host + children)
            const allTableIds = [hostId, ...tableIds];

            // 1. Chuyển tất cả orders chưa thanh toán của bàn con về bàn host
            for (const tableId of tableIds) {
                await connection.execute(
                    `UPDATE orders SET table_id = ? 
                     WHERE table_id = ? AND payment_status = 'unpaid'`,
                    [hostId, tableId]
                );
            }

            // 2. Cập nhật bàn chính
            await connection.execute(
                `UPDATE tables SET 
                 is_merged = TRUE, 
                 merged_tables = ?, 
                 status = 'occupied',
                 updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [JSON.stringify(allTableIds), hostId]
            );

            // 3. Cập nhật các bàn con
            for (const tableId of tableIds) {
                await connection.execute(
                    `UPDATE tables SET 
                     host_id = ?, 
                     status = 'occupied',
                     updated_at = CURRENT_TIMESTAMP 
                     WHERE id = ?`,
                    [hostId, tableId]
                );
            }

            await connection.commit();
            return await this.getTableById(hostId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Tách bàn
    async splitTables(hostId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Lấy thông tin bàn chính
            const hostTable = await this.getTableById(hostId);        
            
            const mergedTableIds = JSON.parse(hostTable.merged_tables || '[]');

            // Kiểm tra có orders chưa thanh toán không
            const [unpaidOrders] = await connection.execute(
                `SELECT COUNT(*) as count FROM orders 
                 WHERE table_id = ? AND payment_status = 'unpaid'`,
                [hostId]
            );

            // Xác định trạng thái sau khi tách
            const hostStatus = unpaidOrders[0].count > 0 ? 'occupied' : 'empty';

            // Reset bàn chính (giữ tất cả orders)
            await connection.execute(
                `UPDATE tables SET 
                 is_merged = FALSE, 
                 merged_tables = NULL,
                 status = ?,
                 updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [hostStatus, hostId]
            );

            // Reset các bàn con
            for (const tableId of mergedTableIds) {
                if (tableId !== hostId) {
                    await connection.execute(
                        `UPDATE tables SET 
                         host_id = NULL,
                         status = 'empty',
                         updated_at = CURRENT_TIMESTAMP 
                         WHERE id = ?`,
                        [tableId]
                    );
                }
            }

            await connection.commit();

            return { success: true, message: 'Tách bàn thành công' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Xóa bàn
    async deleteTable(id) {
        const connection = await pool.getConnection();
        try {       
            const [result] = await connection.execute(
                'DELETE FROM tables WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Chuyển orders chưa thanh toán từ bàn này sang bàn khác (utility method)
    async transferOrders(fromTableId, toTableId) {
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                `UPDATE orders SET table_id = ? 
                 WHERE table_id = ? AND payment_status = 'unpaid'`,
                [toTableId, fromTableId]
            );
            return true;
        } finally {
            connection.release();
        }
    }

    // Lấy bàn trống
    async getAvailableTables() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT * FROM tables 
                WHERE status = 'empty' AND host_id IS NULL
                ORDER BY table_name ASC
            `);
            
            return rows.map(table => ({
                ...table,
                merged_tables: table.merged_tables ? JSON.parse(table.merged_tables) : null,
                role: this.getTableRole(table)
            }));
        } finally {
            connection.release();
        }
    }
}

module.exports = new TableRepository();
