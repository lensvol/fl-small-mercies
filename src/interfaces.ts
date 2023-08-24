interface IApiResponse {
    isSuccess: boolean;
}

export interface IQuality {
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

export interface IShopResponse extends IApiResponse {
    possessionsChanged: IQuality[];
    message: string;
}

export interface IUserData {
    id: number;
    name: string;
    emailAddress: string;
    nex: number;
    createdAt: string;
    hasMessagingEmail: boolean;
}

export interface IUserResponse extends IApiResponse {
    shouldDisplayAuthNag: boolean;
    jwt: string;
    area: any;
    hasCharacter: boolean;
    user: IUserData;
    privilegeLevel: string;
}

export interface IChooseBranchRequest {
    branchId: number;
    secondChanceIds: number[];
}