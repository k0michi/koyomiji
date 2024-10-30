import config from '../koyomiji.config.json';

export interface Category {
  id: string;
  name: string;
}

export interface SiteInfo {
  name: string;
  url: string;
  email: string;
  twitterName: string;
  authorName: string;
  feedID: string;
}

export function getFeatured(): string[] {
  return config.featured;
}

export function getCategory(id: string) {
  const category = config.categories.find(c => c.id == id) as Category;
  return category;
}

export default class SiteConfig {
  static getInfo() {
    return config as SiteInfo;
  }
}