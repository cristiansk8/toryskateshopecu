// Global types for components
declare module '@/components/SearchAndFilter' {
  import { FC } from 'react';
  
  interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
  }

  interface SearchAndFilterProps {
    categories: Category[];
    currentCategory?: Category | null;
    initialSearch?: string;
  }

  const SearchAndFilter: FC<SearchAndFilterProps>;
  export default SearchAndFilter;
}
