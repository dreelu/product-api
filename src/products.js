import { randomUUID } from "crypto";
import sql from './bd.js'

export class DatabasePostgres {
    #videos = new Map()

    async create(produto) {
        
        const produtoID = randomUUID()

        const { nome, preco, estoque } = produto
        
        await sql`INSERT INTO produtos (id, nome, preco, estoque) VALUES (${produtoID}, ${nome}, ${preco}, ${estoque})`
    }

    async list(nome) {
        let produtos

        if (nome && nome != '') {
            produtos = await sql`SELECT * FROM produtos WHERE nome ILIKE ${`%${nome}%`}`
        } else {
            produtos = await sql`SELECT * FROM produtos`
        }
        
        return produtos
    }

    async update(id, produto) {
        const { nome, preco, estoque } = produto

        await sql`UPDATE produtos SET nome = ${nome}, preco = ${preco}, estoque = ${estoque} WHERE id = ${id}`
    }

    async delete(id) {
        await sql`DELETE FROM produtos WHERE id = ${id}`
    }
}