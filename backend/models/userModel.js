// ============================================
// models/userModel.js
// ============================================
const database = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
    async create(userData) {
        const { firstName, lastName, email, password, phone, dateOfBirth } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = `INSERT INTO users (first_name, last_name, email, password, phone, date_of_birth) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        
        const result = await database.query(sql, [
            firstName, 
            lastName, 
            email, 
            hashedPassword, 
            phone, 
            dateOfBirth
        ]);
        
        return result.insertId;
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const results = await database.query(sql, [email]);
        return results[0];
    }

    async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const results = await database.query(sql, [id]);
        return results[0];
    }

    async updateLastLogin(id) {
        const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
        await database.query(sql, [id]);
    }

    async comparePassword(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    async findAll() {
        const sql = 'SELECT id, first_name, last_name, email, phone, is_active, created_at FROM users';
        return await database.query(sql);
    }

    async updateStatus(id, isActive) {
        const sql = 'UPDATE users SET is_active = ? WHERE id = ?';
        await database.query(sql, [isActive, id]);
    }
}

module.exports = new UserModel();