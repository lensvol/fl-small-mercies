interface IApiResponse {
    isSuccess: boolean;
}

export interface IQuality {
    id: number;
    level: number;
    levelDescription: string;
    availableAt: string;
    name: string;
    nameAndLevel: string;
    description: string;
    category: string;
    effectiveLevel: number;
    cap?: number;
    equippable: boolean;
    bonusOrPenaltyDisplay?: string;
    progressAsPercentage: number;
    allowedOn: string;
    himbleLevel: number;
    qualityPossessedId: number;
    enhancements: IEnhancement[];
    nature: string;
    image: string;
    sidebarSettingId?: number;
}

export interface IPossession extends IQuality {}

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

export interface IMyselfPossessionSection {
    categories: string[];
    name: string;
    possessions: IPossession[];
}

export interface IPlayerDomicile {
    name: string;
    description: string;
    image: string;
    maxHandSize: number;
}

export interface IOutfit {
    name: string;
    selected: boolean;
    type: "Standard" | "Exceptional" | "GivenInGame";
    id: number;
}

export interface ICharacterInfo {
    name: string;
    description: string;
    descriptiveText: string;
    avatarImage: string;
    currentDomicile: IPlayerDomicile;
    outfits: IOutfit[];
    mantelpieceItem: IQuality;
    scrapbookStatus: IQuality;
    actions: number;
    journalIsPrivate: boolean;
    user: IUserData;
    canChangeOutfit: boolean;
    setting: ISetting;
    id: number;
}

export interface IMyselfResponse {
    character: ICharacterInfo;
    possessions: IMyselfPossessionSection[];
    restrictedUserInterfaceElements: string[];
}

export interface IMessage {
    message: string;
    image?: string;
    tooltip?: string;
}

export interface IRollSuccessMessage extends IMessage {
    type: "DifficultyRollSuccessMessage";
}

export interface IRollFailureMessage extends IMessage {
    type: "DifficultyRollFailureMessage";
}

export interface IQualityCapMessage extends IMessage {
    type: "QualityCapMessage";
    possession: IPossession;
    priority: number;
    isSidebar: boolean;
    changeType: "Unaltered" | "Increased" | "Decreased";
}

export interface IStandardQualityChangeMessage extends IMessage {
    type: "StandardQualityChangeMessage";
    possession: IPossession;
    priority: number;
    changeType: "Unaltered" | "Increased" | "Decreased";
    message: string;
    image: string;
    tooltip: string;
}

export interface IProgressBar {
    type: "Pyramid";
    leftScore: number;
    rightScore: number;
    startPercentage: number;
    endPercentage: number;
}

export interface IEnhancement {
    qualityName: string;
    qualityId: number;
    level: number;
    category: string;
    affectsPyramid: boolean;
}

export interface IPyramidQualityChangeMessage extends IMessage {
    type: "PyramidQualityChangeMessage";
    changeType: "Unaltered" | "Increased" | "Decreased";
    priority: number;
    progressBar: IProgressBar;
    possession: IPossession;
}

export interface IQualityExplicitlySetMessage extends IMessage {
    type: "QualityExplicitlySetMessage";
    changeType: "Gained" | "Lost";
    possession: IQuality;
    priority: number;
}

export interface IAreaChangeMessage extends IMessage {
    type: "AreaChangeMessage";
    area: IArea;
}

export interface ISettingChangeMessage extends IMessage {
    type: "SettingChangeMessage";
    setting: ISetting;
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

export type IMessageResult =
    | IRollSuccessMessage
    | IRollFailureMessage
    | IQualityCapMessage
    | IStandardQualityChangeMessage
    | IPyramidQualityChangeMessage
    | IQualityExplicitlySetMessage
    | IAreaChangeMessage
    | ISettingChangeMessage;

export interface IChooseBranchResponse extends IApiResponse {
    actions: number;
    phase: string;
    endStorylet?: IEndStorylet;
    // TODO: Verify that this one really exists?
    storylet?: IStorylet;
    hasUpdatedCharacter: boolean;
    canChangeOutfit: boolean;
    messages: IMessageResult[];
    setting: ISetting;
}

export interface IMapMoveResponse extends IApiResponse {
    area: IArea;
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
    image: string;
    category: string;
    nature: string;
    qualityName: string;
    qualityId: number;
    tooltip: string;
    allowedOn: string;
    id: number;
}

export interface IChallenge {
    id: number;
    name: string;
    image: string;
    targetNumber: number;
    type: string;
    category: string;
    description: string;
    nature: string;
    secondChangeId: number;
    secondChanceDescription: string;
    secondChanceLevel: number;
    canAffordSecondChance: boolean;
}

export interface IBranch {
    challenges: IChallenge[];
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
    qualityRequirements: IQualityRequirement[];
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

export interface IEquipmentSlot {
    name: string;
    qualityId?: number;
    canChange: boolean;
    isEffect: boolean;
    isOutfit: true;
}

export interface IOutfitChangeRequest {
    outfitId: number;
}

export interface IAgentReportResponse extends IApiResponse {
    agentId: number;
    canChangeOutfit: boolean;
    actions: number;
    phase: string;
    storylet: IStorylet;
    hasUpdatedCharacter: boolean;
}

export interface IEquipResponse extends IApiResponse {
    slots: IEquipmentSlot[];
    dirty: boolean;
    maxOutfits: number;
    isFavourite: boolean;
}

export interface IMapJsonInfo {
    hideLabel: boolean;
    labelX: number;
    labelY: number;
    spriteTopLeftX: number;
    spriteTopLeftY: number;
}

export interface IArea {
    id: number;
    name: string;
    description: string;
    unavailableDescription: string;
    image: string;
    hideName: boolean;
    showOps: boolean;
    premiumSubRequired: boolean;
    canChangeOutfit: boolean;
    canMoveTo: boolean;
    discovered: boolean;
    unlocked: boolean;
    type: boolean;
    parentAreaKey: string;
    areaKey: string;
    childAreas: IArea[];
    jsonInfo?: IMapJsonInfo;
}

export interface IMapResponse extends IApiResponse {
    currentArea: IArea;
    areas: IArea[];
}

export interface IPlan {
    id: number;
    areaName: string;
    branch: IBranch;
}

export interface IPlanResponse extends IApiResponse {
    active: IPlan[];
    complete: IPlan[];
}

export interface IOpportunityCard {
    category: string;
    eventId: number;
    name: string;
    unlockedWithDescription: string;
    teaser: string;
    image: string;
    isAutoFire: boolean;
    stickiness: string;
    qualityRequirements: IQualityRequirement[];
}

export interface IOpportunityResponse extends IApiResponse {
    isInAStorylet: boolean;
    displayCards: IOpportunityCard[];
    eligibleForCardsCount: number;
    maxHandSize: number;
    maxDeckSize: number;
    currency: number;
    nextActionAt: string;
    currentTime: string;
}

export interface IActionsResponse {
    nextActionAt: string;
    currentTime: string;
    actionBankSize: number;
    actions: number;
}
