// ============================================
// models/adminModel.js
// ============================================
const database = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminModel {
    async create(adminData) {
        const { name, email, password, role } = adminData;
        
        const hashedPassword = await bcrypt.hash(password, 12); // Use 12 rounds for security
        
        const sql = `INSERT INTO admins (name, email, password, role) 
                     VALUES (?, ?, ?, ?)`;
        
        const result = await database.query(sql, [
            name,
            email,
            hashedPassword,
            role || 'Viewer'
        ]);
        
        return result.insertId;
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM admins WHERE email = ?';
        const results = await database.query(sql, [email]);
        return results[0];
    }

        async findById(id) {
        const sql = 'SELECT id, name, email, role, created_at, updated_at FROM admins WHERE id = ?';
        const results = await database.query(sql, [id]);
        return results[0];
    }

    async findAll() {
        const sql = 'SELECT id, name, email, role, created_at, updated_at FROM admins ORDER BY created_at DESC';
        return await database.query(sql);
    }

    async search(query) {
        const searchTerm = `%${query}%`;
        const sql = `SELECT id, name, email, role, created_at, updated_at 
                     FROM admins 
                     WHERE name LIKE ? OR email LIKE ? OR role LIKE ?
                     ORDER BY created_at DESC`;
        
        return await database.query(sql, [searchTerm, searchTerm, searchTerm]);
    }
    

    async update(id, adminData) {
        const { name, email, role } = adminData;
        
        const sql = `UPDATE admins 
                     SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
                     WHERE id = ?`;
        
        const result = await database.query(sql, [name, email, role, id]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = 'DELETE FROM admins WHERE id = ?';
        const result = await database.query(sql, [id]);
        return result.affectedRows > 0;
    }

    async search(query) {
        const searchTerm = `%${query}%`;
        const sql = `SELECT id, name, email, role, status, created_at, updated_at 
                     FROM admins 
                     WHERE name LIKE ? OR email LIKE ? OR role LIKE ?
                     ORDER BY created_at DESC`;
        
        return await database.query(sql, [searchTerm, searchTerm, searchTerm]);
    }

    async updateLastLogin(id) {
        const sql = 'UPDATE admins SET last_login = NOW() WHERE id = ?';
        await database.query(sql, [id]);
    }

    async comparePassword(candidatePassword, hashedPassword) {
        try {
            console.log('🔐 Comparing passwords...');
            console.log('📝 Candidate password:', candidatePassword);
            console.log('🔒 Hashed password length:', hashedPassword ? hashedPassword.length : 'null');
            
            if (!hashedPassword) {
                console.log('❌ No hashed password provided');
                return false;
            }
            
            const isValid = await bcrypt.compare(candidatePassword, hashedPassword);
            console.log('✅ Password comparison result:', isValid);
            return isValid;
        } catch (error) {
            console.error('💥 Password comparison error:', error);
            return false;
        }
    }

    async emailExists(email, excludeId = null) {
        let sql = 'SELECT id FROM admins WHERE email = ?';
        let params = [email];
        
        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }
        
        const results = await database.query(sql, params);
        return results.length > 0;
    }
}

module.exports = new AdminModel();