export interface ValidationErrors {
  error: boolean;
  errorMessage: string;
  status?: number;
  adtionals?: any;
}
export interface Coordenadas {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
