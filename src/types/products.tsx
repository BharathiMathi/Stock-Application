export type TProduct = {
    name: string;
    image:string;
    priceIncludingTax:string;
    currency:string;
    contain_articles: TArticle[];
};

export interface IProductDetails extends TProduct {
  status?: string;
}

export type TArticle = {
  art_id: string;
  amount_of: string;
};


