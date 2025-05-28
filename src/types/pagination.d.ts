declare module '@/components/ui/pagination' {
  export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    baseUrl: string;
    maxDisplayedPages?: number;
  }
  
  export function Pagination(props: PaginationProps): JSX.Element | null;
} 