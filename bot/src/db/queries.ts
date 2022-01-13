import pg from 'pg'

interface DBProductSchema{
    name: string;
    description: string;
    category_id: number;
    img_urls: string[];
    brand_id: number;
    gender_id: number;
    release_date: string;
    color_id: number;
    retail_price: number;
    sku: string;
    shipping_cost_aprox_per_100km: number;
    collection_ids: number[];
    colorway: string;
    sub_category_ids: number[];
    tag_ids: number[];
    brand_collection_id: number;
    size_ids: number[];
    size_group_id: number;
    url_key: string;
    traits: Record<string, any>;
    title: string;
    tags: string[];
    stockx_uuid: string;
    stockx_media: Record<string, any>;
    media: Record<string, any>;
    sizes: string[];
    collection_id: number;
}

export async function getProduct(client: pg.Client, uuid): Promise<any> {
    const res = await client.query('SELECT * FROM product WHERE stockx_uuid = $1 LIMIT 1', [uuid])
    return res.rows[0]
}

export async function createProduct(client: pg.Client, data: DBProductSchema): Promise<any> {
    const res = await client.query(`
    INSERT INTO product(
    ${Object.keys(data).join(',')}
    ) VALUES(${Array(Object.keys(data).length).fill(1).map((x, y) => `$${(x + y)}`).join(',')})
    `, Object.values(data))
}

export async function updateProduct(client: pg.Client, uuid: string, media: string, sizes: string): Promise<any> {
    const res = await client.query('UPDATE product SET media = $1, sizes=$2 WHERE stockx_uuid = $3 ', [media, sizes,uuid])
    return res.rows[0]
}

export async function getCategory(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, name FROM category WHERE name ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createCategory(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO categoria(name) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}

export async function getBrand(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, name FROM brand WHERE name ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createBrand(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO brand(name) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}

export async function getColor(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, name FROM color WHERE name ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createColor(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO color(name) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}

export async function getGender(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, name FROM gender WHERE name ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createGender(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO gender(name) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}

export async function getCollection(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, name FROM collection WHERE name ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createCollection(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO collection(name) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}

export async function getSize(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('SELECT id, usa FROM size WHERE usa ILIKE($1) LIMIT 1', [name])
    return res.rows[0]
}
export async function createSize(client: pg.Client, name: string): Promise<Record<string, any>> {
    const res = await client.query('INSERT INTO size(usa) VALUES($1) RETURNING id', [name])
    return res.rows[0]
}
