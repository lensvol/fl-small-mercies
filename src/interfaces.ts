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

export interface IBeginStoryletRequest {
    eventId: number;
}

export interface IBeginStoryletResponse extends IApiResponse {
    actions: number;
    phase: string;
    hasUpdatedCharacter: boolean;
    canChangeOutfit: boolean;
    storylet: IStorylet;
}

export interface ISnippet {
    id: number;
    title: string;
    description: string;
    image: string;
}

export interface ICustomSnippet {
    author: string;
    link: string;
    title: string;
    description: string;
}

export interface IAdvert {
    image: string;
    altText: string;
    url: string;
}

export interface IInfobarResponse {
    snippets: ISnippet[];
    advert: IAdvert;
}

interface IChallenge {
    name: string;
    targetNumber: number;
    description: string;
    category: string;
    nature: string;
    canAffordSecondChance: boolean;
    secondChanceId: number;
    secondChanceDescription: string;
    secoldChanceLevel: number;
    image: string;
    id: number;
}

export interface IQualityRequirement extends IQuality {
    allowedOn: string;
    qualityId: number;
    qualityName: string;
    tooltip: string;
    category: string;
    nature: string;
    status: string;
    isCost: boolean;
    image: string;
    id: number;
}

export interface IBranch {
    name: string;
    description: string;
    planKey: string;
    currencyCost: number;
    actionCost: number;
    buttonText: string;
    challenges: IChallenge[];
    qualityRequirements: IQualityRequirement[];
}

export interface IStorylet {
    id: number;
    deckType: string;
    distribution: string;
    name: string;
    description: string;
    image: string;
    teaser: string;
    urgency: string;
    category: string;
    canGoBack: boolean;
    isLocked: boolean;
    childBranches: IBranch[];
}

export interface IStoryletResponse extends IApiResponse {
    storylet: IStorylet;
    actions: number;
    phase: string;
    hasUpdatedCharacter: boolean;
    canChangeOutfit: boolean;
}

export interface IStoryletListResponse extends IApiResponse {
    actions: number;
    phase: string;
    hasUpdatedCharacter: boolean;
    canChangeOutfit: boolean;
    storylets: IStorylet[];
}
