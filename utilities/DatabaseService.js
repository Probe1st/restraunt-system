// lib/DatabaseService.js
import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,

    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
});

export class DatabaseService {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Получение всех записей
    async getAll() {
        const client = await pool.connect();
        try {
            const res = await client.query(`SELECT * FROM ${this.tableName}`);
            return res.rows;
        } finally {
            client.release();
        }
    }

    // Получение записи по ID
    async getById(id) {
        const client = await pool.connect();
        try {
            const res = await client.query(
                `SELECT * FROM ${this.tableName} WHERE id = $1`,
                [id],
            );
            return res.rows[0];
        } finally {
            client.release();
        }
    }

    // Создание новой записи
    async create(data) {
        const client = await pool.connect();
        try {
            const keys = Object.keys(data).join(", ");
            const values = Object.values(data);
            const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
            const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders}) RETURNING *`;
            const res = await client.query(query, values);
            return res.rows[0];
        } finally {
            client.release();
        }
    }

    // Обновление записи
    async update(id, data) {
        const client = await pool.connect();
        try {
            const updates = Object.keys(data)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(", ");
            const values = Object.values(data);
            const query = `UPDATE ${
                this.tableName
            } SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
            const res = await client.query(query, [...values, id]);
            return res.rows[0];
        } finally {
            client.release();
        }
    }

    // Удаление записи
    async delete(id) {
        const client = await pool.connect();
        try {
            const res = await client.query(
                `DELETE FROM ${this.tableName} WHERE id = $1`,
                [id],
            );
            return res.rowCount > 0;
        } finally {
            client.release();
        }
    }
}
