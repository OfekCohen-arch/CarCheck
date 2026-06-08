export interface Answer {
  budget?: string;
  usage?: string;
  familySize?: string;
  priority?: string;
  maxAge?: string;
  maxKm?: string;
}
export interface Car {
  name: string;
  years: string;
  priceRange: string;
  avgKm: string;
  reliability: number;
  fuelEconomy: number;
  comfort: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  score: number;
}
export interface Analysis {
  verdict: string;
  score: number;
  priceAssessment: string;
  kmAssessment: string;
  summary: string;
  warnings: string[];
  tips: string[];
}