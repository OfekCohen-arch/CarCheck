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
  ownersAssessment : string;
  kmAssessment: string;
  summary: string;
  warnings: string[];
  tips: string[];
}
export interface CarGovData {
  plate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  fuelType: string;
  trim: string;
  lastTest: string;
  licenseExpiry: string | null;
  onRoadSince : string | null;
  ownership : string;
  owners : number | null;
  tires: string;
  vin : string;
  engineSize: number | null;
  horsepower: number | null;
  seats: number | null;
  weight: number | null;
}
export interface CarFormData {
  make: string;
  model: string;
  year: string;
  km: string;
  price: string;
}
