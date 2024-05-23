import PocketBase from "pocketbase";

const pb = new PocketBase("https://phoenix-helpcenter.pockethost.io");

export const getAllCategories = async () => {
  return await pb.collection("categories").getFullList({
    sort: "-created",
  });
};

export const getCategoryById = async (id: string) => {
  return await pb.collection("categories").getList(1, 50, {
    filter: `id="${id}"`,
  });
};

export const getAllArticles = async () => {
  return await pb.collection("articles").getFullList({
    sort: "-created",
    fields: "*, content:excerpt(100, true)",
  });
};

export const getFeaturedArticles = async () => {
  return await pb.collection("articles").getList(1, 50, {
    filter: "featured = true",
    fields: "*, content:excerpt(100, true)",
  });
};

export const getArticleById = async (id: string) => {
  return await pb.collection("articles").getList(1, 50, {
    filter: `id="${id}"`,
  });
};

export const getArticlesByCategory = async (category: string) => {
  return await pb.collection("categories").getOne(category, {
    expand: "articles",
  });
};

export const searchArticles = async (query: string) => {
  return await pb.collection("articles").getList(1, 20, {
    filter: pb.filter(
      "id ~ {:search} || category ~ {:search} || title ~ {:search} || description ~ {:search} || content ~ {:search}",
      { search: query }
    ),
    fields: "*, content:excerpt(100, true)",
  });
};
