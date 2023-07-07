export interface awattarResponse {
  object: string;
  data: [];
}

export interface awattarPrice {
  start_timestamp: number;
  end_timestamp: number;
  marketprice: number;
  unit: string;
}

export interface chartPrice {
  value: number;
  label: string;
  labelComponent: any;
}

export interface priceStatistics {
  min: number;
  max: number;
  hasNegativePrice: boolean;
}
