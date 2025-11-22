// ============================================
// database/setupDatabase.js - UPDATED VEHICLES TABLE
// ============================================
const database = require('../config/db');

class DatabaseSetup {
    async setupTables() {
        try {
            console.log('🗃️ Setting up database tables...');
            
            // Create vehicles table with capacity column
            await this.createVehiclesTable();
            await this.createUsersTable();
            await this.createAdminsTable();
            await this.createBookingsTable();
            await this.createPaymentsTable();
            
            console.log('✅ All database tables created successfully');
            
            // Create default admin
            await this.createDefaultAdmin();
            
        } catch (error) {
            console.error('💥 Database setup error:', error);
            throw error;
        }
    }

    async createVehiclesTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS vehicles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                brand VARCHAR(100) NOT NULL,
                model VARCHAR(100) NOT NULL,
                year INT NOT NULL,
                capacity INT DEFAULT 5,
                fuel_type VARCHAR(50),
                transmission VARCHAR(50),
                features TEXT,
                price_per_day DECIMAL(10,2) NOT NULL,
                price_per_hour DECIMAL(10,2),
                availability BOOLEAN DEFAULT TRUE,
                location VARCHAR(255),
                status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await database.query(sql);
        console.log('✅ Vehicles table created/verified');
    }

    async createUsersTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                license_number VARCHAR(100),
                status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await database.query(sql);
        console.log('✅ Users table created/verified');
    }

    async createAdminsTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await database.query(sql);
        console.log('✅ Admins table created/verified');
    }

    async createBookingsTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                vehicle_id INT NOT NULL,
                start_date DATETIME NOT NULL,
                end_date DATETIME NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
            )
        `;
        
        await database.query(sql);
        console.log('✅ Bookings table created/verified');
    }

    async createPaymentsTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
                transaction_id VARCHAR(255),
                payment_date TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
            )
        `;
        
        await database.query(sql);
        console.log('✅ Payments table created/verified');
    }

    

    async createDefaultAdmin() {
        try {
            const bcrypt = require('bcryptjs');
            
            // Check if admin already exists
            const checkSql = 'SELECT id FROM admins WHERE email = ?';
            const existingAdmin = await database.query(checkSql, ['admin@reliantrental.com']);
            
            if (existingAdmin.length === 0) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                const insertSql = `
                    INSERT INTO admins (name, email, password, role) 
                    VALUES (?, ?, ?, ?)
                `;
                
                await database.query(insertSql, [
                    'Super Admin',
                    'admin@reliantrental.com',
                    hashedPassword,
                    'super_admin'
                ]);
                
                console.log('✅ Default admin created: admin@reliantrental.com / admin123');
            } else {
                console.log('✅ Default admin already exists');
            }
        } catch (error) {
            console.error('💥 Error creating default admin:', error);
        }
    }
}

module.exports = new DatabaseSetup();