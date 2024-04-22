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

export interface IMessage {
    message: string;
    image: string;
    tooltip: string;
}

export interface IRollSuccessMessage extends IMessage {
    type: "DifficultyRollSuccessMessage";
}

export interface IRollFailureMessage extends IMessage {
    type: "DifficultyRollFailureMessage";
}

export interface IQualityCapMessage extends IMessage {
    type: "QualityCapMessage";
    possession: IQuality;
    priority: number;
    isSidebar: boolean;
    changeType: "Unaltered" | "Increased" | "Decreased";
}

export interface ISetting {
    id: number;
    mapRootArea: Record<string, string>;
    name: string;
    canChangeOutfit: boolean;
    canOpenMap: boolean;
    canTravel: boolean;
    itemsUsableHere: boolean;
    isInfiniteDraw: boolean;
}

export interface IStoryletStub {
    id: number;
    name: string;
    description: string;
    image: string;
    deckType: string;
    isInEventUseTree: boolean;
}

export interface IEndStorylet {
    rootEventId: number;
    event: IStoryletStub;
    isLinkingEvent: boolean;
    isDirectLinkingEvent: boolean;
    canGoAgain: boolean;
}

type IMessageResult = IRollSuccessMessage | IRollFailureMessage | IQualityCapMessage;

export interface IChooseBranchResponse extends IApiResponse {
    actions: number;
    phase: string;
    endStorylet: IEndStorylet;
    hasUpdatedCharacter: boolean;
    canChangeOutfit: boolean;
    messages: IMessageResult[];
    setting: ISetting;
}

export interface IBeginStoryletRequest {
    eventId: number;
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

export interface IQualityRequirement {
    qualityName: string;
    qualityId: number;
    tooltip: string;
    id: number;
}

export interface IBranch {
    id: number;
    name: string;
    description: string;
    ordering: number;
    image: string;
    isLocked: boolean;
    actionLocked: boolean;
    qualityLocked: boolean;
    currencyLocked: boolean;
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
