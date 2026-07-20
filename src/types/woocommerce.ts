export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  description?: string;
  short_description?: string;
  prices?: {
    price?: string;
    currency_code?: string;
    currency_symbol?: string;
  };
  images?: Array<{
    src: string;
    alt?: string;
  }>;
}
