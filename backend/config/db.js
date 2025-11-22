// ============================================
// config/db.js - Database Configuration
// ============================================
const mysql = require('mysql2');
const config = require('./config');

class Database {
    constructor() {
        this.pool = null;
        this.connection = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.pool = mysql.createPool({
                    host: config.DB_HOST,
                    port: config.DB_PORT,
                    user: config.DB_USER,
                    password: config.DB_PASSWORD,
                    database: config.DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0,
                    acquireTimeout: 60000,
                    timeout: 60000,
                    reconnect: true
                });

                // Test connection
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error('💥 Database connection failed:', err.message);
                        reject(err);
                        return;
                    }
                    
                    console.log('✅ MySQL Connected Successfully');
                    console.log(`📊 Database: ${config.DB_NAME}`);
                    console.log(`🔗 Host: ${config.DB_HOST}:${config.DB_PORT}`);
                    
                    if (connection) connection.release();
                    resolve();
                });

            } catch (error) {
                console.error('💥 Database configuration error:', error);
                reject(error);
            }
        });
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            console.log('📊 Executing SQL query:', sql.substring(0, 100) + '...');
            if (params.length > 0) {
                console.log('📋 Query params:', params);
            }

            this.pool.execute(sql, params, (error, results, fields) => {
                if (error) {
                    console.error('💥 Database query error:', error);
                    console.error('📝 SQL:', sql);
                    console.error('🔧 Params:', params);
                    reject(error);
                    return;
                }
                
                resolve(results);
            });
        });
    }

    close() {
        return new Promise((resolve) => {
            if (this.pool) {
                this.pool.end((err) => {
                    if (err) {
                        console.error('💥 Error closing database connection:', err);
                    } else {
                        console.log('✅ Database connection closed');
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = new Database();