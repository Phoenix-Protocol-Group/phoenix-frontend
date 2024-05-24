/**
 * Generated types from pocketbase
 * For reference see https://github.com/patmood/pocketbase-typegen
 * @example
 */
/**
 * This file was @generated using pocketbase-typegen
 */

import PocketBase, { RecordService } from "pocketbase";

export enum Collections {
  Articles = "articles",
  Categories = "categories",
  Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection
export type ArticlesRecord = {
  category?: RecordIdString[];
  content?: HTMLString;
  description?: string;
  featured?: boolean;
  thumbnail?: string;
  title?: string;
};

export type CategoriesRecord = {
  articles?: RecordIdString[];
  thumbnail?: string;
  title?: string;
};

export type UsersRecord = {
  avatar?: string;
  name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type ArticlesResponse<Texpand = unknown> = Required<ArticlesRecord> &
  BaseSystemFields<Texpand>;
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> &
  BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions
export type CollectionRecords = {
  articles: ArticlesRecord;
  categories: CategoriesRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  articles: ArticlesResponse;
  categories: CategoriesResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions
export type TypedPocketBase = PocketBase & {
  collection(idOrName: "articles"): RecordService<ArticlesResponse>;
  collection(idOrName: "categories"): RecordService<CategoriesResponse>;
  collection(idOrName: "users"): RecordService<UsersResponse>;
};

/**
 * Custom types for the help center
 */
export interface HelpCenterArticle {
  id: string;
  category: string[];
  collectionId: string;
  collectionName: string;
  content: string;
  created: string;
  description: string;
  thumbnail: string;
  title: string;
  featured?: boolean;
  updated: string;
}
