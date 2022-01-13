export {client as db_client} from "./pg"
export {
    getGender, getColor, getProduct, getBrand, getCategory,
    createBrand, createCategory, createColor, createGender,
    createProduct, updateProduct, createSize, getSize,
    getCollection, createCollection
} from './queries'