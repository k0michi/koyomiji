import config from '../config.json';

export interface Category {
  id:string;
  name:string;
}

export function getCategory(id: string) {
  const category = config.categories.find(c => c.id == id) as Category;
  return category;
}