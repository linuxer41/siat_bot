interface SotckSearchResponse {
  Pagination: Pagination;
  Facets: Facets;
  Products: BrowseProduct[];
}

interface Facets {
  year: { [key: string]: number };
  brand: { [key: string]: number };
  gender: string;
  dataType: string;
  releaseTime: { [key: string]: number };
  "market.featured": { [key: string]: number };
  productCategory: string;
  "market.lowestAsk": { [key: string]: number };
  "market.highestBid": { [key: string]: number };
  "market.volatility": { [key: string]: number };
  "market.pricePremium": { [key: string]: number };
  "market.deadstockSold": { [key: string]: number };
  "market.changePercentage": { [key: string]: number };
  "market.salesLast72Hours": { [key: string]: number };
  "market.lastLowestAskTime": { [key: string]: number };
  "market.lastHighestBidTime": { [key: string]: number };
  "market.averageDeadstockPrice": { [key: string]: number };
}


interface Pagination {
  query: string;
  queryID: string;
  index: string;
  limit: string;
  page: number;
  total: number;
  lastPage: string;
  sort: string[];
  order: string[];
  currentPage: string;
  nextPage: null;
  previousPage: null;
}

interface BrowseProduct {
  id: string;
  uuid: string;
  brand: string;
  breadcrumbs: any[];
  category: string;
  charityCondition: number;
  childId: null;
  colorway: string;
  condition: string;
  countryOfManufacture: string;
  dataType: string;
  description: string;
  hidden: boolean;
  listingType: string;
  minimumBid: number;
  gender: string;
  doppelgangers: any[];
  media: Media;
  name: string;
  productCategory: string;
  releaseDate: string;
  releaseTime: number;
  belowRetail: boolean;
  retailPrice: number;
  shoe: string;
  shortDescription: string;
  styleId: string;
  tickerSymbol: string;
  title: string;
  traits: Trait[];
  type: number;
  urlKey: string;
  year: number;
  shoeSize: null;
  market: Market;
  _tags: string[];
  lock_selling: boolean;
  selling_countries: string[];
  buying_countries: string[];
  objectID: string;
}


interface Market {
  productId: number;
  skuUuid: string;
  productUuid: string;
  lowestAsk: number;
  lowestAskSize: string;
  parentLowestAsk: number;
  numberOfAsks: number;
  hasAsks: number;
  salesThisPeriod: number;
  salesLastPeriod: number;
  highestBid: number;
  highestBidSize: string;
  numberOfBids: number;
  hasBids: number;
  annualHigh: number;
  annualLow: number;
  deadstockRangeLow: number;
  deadstockRangeHigh: number;
  volatility: number;
  deadstockSold: number;
  pricePremium: number;
  averageDeadstockPrice: number;
  lastSale: number;
  lastSaleSize: string;
  salesLast72Hours: number;
  changeValue: number;
  changePercentage: number;
  absChangePercentage: number;
  totalDollars: number;
  lastLowestAskTime: number;
  lastHighestBidTime: number;
  lastSaleDate: string;
  createdAt: string;
  updatedAt: number;
  deadstockSoldRank: number;
  pricePremiumRank: number;
  averageDeadstockPriceRank: number;
  featured: number;
}

interface Media {
  imageUrl: string;
  smallImageUrl: string;
  thumbUrl: string;
  gallery: any[];
  hidden: boolean;
}



interface Trait {
  name: string;
  value: boolean | number | string;
  filterable: boolean;
  visible: boolean;
  highlight: boolean;
}
