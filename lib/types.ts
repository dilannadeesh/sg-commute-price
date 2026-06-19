export interface Area {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface TimeBlock {
  id: string;
  label: string;
  short: string;
  surge: number;
  surgeLabel: string | null;
}

export interface Platform {
  id: string;
  name: string;
  kind: "hail" | "share" | "transit";
  color: string;
  short: string;
  base: number;
  perKm: number;
  perMin: number;
  surgeable: boolean;
  speedKmh: number;
  etaMin: number;
}

export interface FlexarStation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

export interface GetGoPod {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface FlexarOpts {
  walkSpeedKmh?: number;
  maxWalkKm?: number;
  servicedRegions?: string[];
}

export interface FlexarResult {
  pickupStation: FlexarStation;
  dropoffStation: FlexarStation;
  walkInMin: number;
  walkInKm: number;
  walkOutMin: number;
  walkOutKm: number;
  driveMin: number;
  originTown: string;
  destTown: string;
}

export interface GetGoResult {
  oneWayKm: number;
  oneWayMin: number;
  stopoverMin: number;
  stopoverHours: number;
  nearestPod?: GetGoPod;
  walkToPickupKm?: number;
  walkToPickupMin?: number;
}

export interface QuoteResult {
  platformId: string;
  price: number;
  minutes: number;
  eta: number;
  surge: number;
  surgeLabel: string | null;
  transfers: number | null;
  km: number;
  flexar?: FlexarResult;
  getgo?: GetGoResult;
  unavailable?: boolean;
  reason?: string;
  platform: Platform;
  isCheapest: boolean;
  isFastest: boolean;
  isBestValue: boolean;
  valueScore: number;
}

export interface QuoteOpts {
  flexar?: FlexarOpts;
  getgoStopoverHours?: number;
  flexarStations?: FlexarStation[];
  getgoPods?: GetGoPod[];
}

export interface Deal {
  id: number;
  text: string;
  excerpt: string;
  date: string;
  tags: string[];
  telegramUrl: string;
  moreInfoUrl: string;
  imageUrl?: string;
}

export interface ItinerarySlot {
  time: string;
  type: "meal" | "activity";
  mealType?: string;
  title: string;
  excerpt: string;
  estimatedCostPerPax: number;
  totalCost: number;
  imageUrl?: string;
  moreInfoUrl: string;
  telegramUrl?: string;
  tags: string[];
  isRealDeal: boolean;
  dealBadge?: string;
}

export interface PlanResponse {
  itinerary: ItinerarySlot[];
  totalCostMin: number;
  totalCostMax: number;
  pax: number;
  generatedAt: string;
}

export interface AirlineDeal {
  id: number;
  text: string;
  excerpt: string;
  date: string;
  destination?: string;
  airline?: string;
  price?: string;
  telegramUrl: string;
  moreInfoUrl: string;
  imageUrl?: string;
}
