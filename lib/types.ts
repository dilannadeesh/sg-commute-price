export interface Area {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
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
  x: number;
  y: number;
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
  walkOutMin: number;
  driveMin: number;
  originStationCount: number;
  destStationCount: number;
  originTown: string;
  destTown: string;
}

export interface GetGoResult {
  oneWayKm: number;
  oneWayMin: number;
  stopoverMin: number;
  stopoverHours: number;
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
}
