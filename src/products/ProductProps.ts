export interface ItemProps {
  _id?: string;
  name: string;
  description: string;
  expiration_date : string;
  available: boolean;
  status: number;
  version: number;
  photoPath: string;
  latitude:number;
  longitude:number;
}
