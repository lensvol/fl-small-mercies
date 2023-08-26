import {IQuality} from "./interfaces.js";

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

class Branch {
    private branchId = -1;
    private name = "";
    private _image = "question";
    private _description = "";
    private _actionCost = 0;
    private _actionLocked = false;
    private _challenges = [];
    private _currencyCost = 0;
    private _currencyLocked = false;
    private _isLocked = false;
    private _ordering = 0;
    private _qualityLocked = false;
    private _qualityRequirements: IQuality[] = [];
    private _buttonText = "GO";

    constructor(branchId: number, name: string) {
        this.branchId = branchId;
        this.name = name;
        return this;
    }

    description(text: string) {
        this._description = text;
        return this;
    }

    isLocked(boolean_value: boolean) {
        this._isLocked = boolean_value;
        return this;
    }

    qualityLocked(boolean_value: boolean) {
        this._qualityLocked = boolean_value;
        return this;
    }

    qualityRequirement(req: IQuality) {
        this._qualityRequirements.push(req);
        return this;
    }

    buttonText(text: string) {
        this._buttonText = text;
        return this;
    }

    image(imageId: string) {
        this._image = imageId;
        return this;
    }

    actionCost(cost: number) {
        this._actionCost = cost;
        return this;
    }

    build() {
        return {
            name: this.name,
            description: capitalize(this._description),
            actionCost: this._actionCost,
            actionLocked: this._actionLocked,
            challenges: this._challenges,
            currencyCost: this._currencyCost,
            currencyLocked: this._currencyLocked,
            id: this.branchId,
            image: this._image,
            isLocked: this._isLocked,
            ordering: this._ordering,
            buttonText: this._buttonText,
            planKey: "1234567890abcdefghijklmnopqrstuv",
            qualityLocked: this._qualityLocked,
            qualityRequirements: this._qualityRequirements,
        };
    }
}

class Storylet {
    private _category = "";
    private readonly _name: string = "";
    private _image = "questionsmall";
    private readonly _id: number = -1;
    private _description = "";
    private _teaser = "";
    private _buttonText = "GO";
    private _branches: Branch[] = [];
    private _isLocked = false;
    private _canGoBack = true;

    constructor(storyletId: number, name: string) {
        this._category = "";
        this._name = name;
        this._image = "questionsmall";
        this._description = "";
        this._id = storyletId;
        this._teaser = "";
        this._buttonText = "GO";
        this._branches = [];
        this._isLocked = false;
        this._canGoBack = true;
        return this;
    }

    category(name: string) {
        this._category = name;
        return this;
    }

    canGoBack(boolean_value: boolean) {
        this._canGoBack = boolean_value;
    }

    isLocked(boolean_value: boolean) {
        this._isLocked = boolean_value;
        return this;
    }

    buttonText(text: string) {
        this._buttonText = text;
        return this;
    }

    teaser(text: string) {
        this._teaser = text;
        return this;
    }

    description(text: string) {
        this._description = text;
        return this;
    }

    image(imageId: string) {
        this._image = imageId;
        return this;
    }

    addBranch(branch: Branch) {
        this._branches.push(branch);
        return this;
    }

    build(): Record<string, unknown> {
        return {
            category: this._category,
            buttonText: this._buttonText,
            childBranches: this._branches.map((b) => b.build()),
            description: this._description,
            distribution: 0,
            frequency: "Always",
            id: this._id,
            image: this._image,
            isInEventUseTree: false,
            isLocked: this._isLocked,
            canGoBack: this._canGoBack,
            name: this._name,
            qualityRequirements: [],
            teaser: this._teaser,
            urgency: "Normal",
        };
    }
}

export {Branch, Storylet};
