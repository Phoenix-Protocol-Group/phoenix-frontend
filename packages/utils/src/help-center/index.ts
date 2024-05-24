import PocketBase from "pocketbase";
import {
  ArticlesRecord,
  CategoriesRecord,
  CategoriesResponse,
} from "@phoenix-protocol/types";

const pb = new PocketBase("https://phoenix-helpcenter.pockethost.io");

/**
 * Get all categories
 * @returns {Promise<CategoriesRecord[]>}
 * @example
 * const categories = await getAllCategories();
 * console.log(categories);
 */
export const getAllCategories = async (): Promise<CategoriesRecord[]> => {
  return await pb.collection("categories").getFullList({
    sort: "-created",
  });
};

/**
 * Get category by id
 * @param {string} id - Category id
 * @returns {Promise<CategoriesRecord>}
 * @example
 * const category = await getCategoryById("123");
 * console.log(category);
 */
export const getCategoryById = async (
  id: string
): Promise<CategoriesRecord> => {
  return await pb.collection("categories").getOne<CategoriesResponse>(id);
};

/**
 * Get all articles
 * @returns {Promise<ArticlesRecord[]>}
 * @example
 * const articles = await getAllArticles();
 * console.log(articles);
 */
export const getAllArticles = async (): Promise<ArticlesRecord[]> => {
  return await pb.collection("articles").getFullList({
    sort: "-created",
    fields: "*, content:excerpt(100, true)",
  });
};

/**
 * Get featured articles
 * @returns {Promise<ArticlesRecord[]>}
 * @example
 * const featuredArticles = await getFeaturedArticles();
 * console.log(featuredArticles);
 */
export const getFeaturedArticles = async (): Promise<ArticlesRecord[]> => {
  return await pb.collection("articles").getFullList({
    filter: "featured = true",
    fields: "*, content:excerpt(100, true)",
  });
};

/**
 * Get article by id
 * @param {string} id - Article id
 * @returns {Promise<ArticlesRecord>}
 * @example
 * const article = await getArticleById("123");
 * console.log(article);
 */
export const getArticleById = async (id: string): Promise<ArticlesRecord> => {
  return await pb.collection("articles").getOne(id);
};

/**
 * Get articles by category
 * @param {string} category - Category name
 * @returns {Promise<CategoriesRecord>}
 * @example
 * const articles = await getArticlesByCategory("Getting Started");
 * console.log(articles);
 */
export const getArticlesByCategory = async (
  category: string
): Promise<CategoriesRecord> => {
  return await pb.collection("categories").getOne(category, {
    expand: "articles",
  });
};

/**
 * Search articles
 * @param {string} query - Search query
 * @returns {Promise<any>}
 * @example
 * const articles = await searchArticles("Getting Started");
 * console.log(articles);
 */
export const searchArticles = async (query: string): Promise<any> => {
  return await pb.collection("articles").getList(1, 20, {
    filter: pb.filter(
      "id ~ {:search} || category ~ {:search} || title ~ {:search} || description ~ {:search} || content ~ {:search}",
      { search: query }
    ),
    fields: "*, content:excerpt(100, true)",
  });
};
