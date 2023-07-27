interface IApiResponse {
    isSuccess: boolean;
}

interface IQuality {
  id: number;
  level: number;
  name: string;
  description: string;
  category: string;
  effectiveLevel: number;
  cap?: number;
  nature: string;
  image: string;
}

interface IShopResponse extends IApiResponse {
    possessionsChanged: IQuality[];
    message: string;
}
