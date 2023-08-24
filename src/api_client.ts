import {FLApiInterceptor} from "./api_interceptor.js";

const API_ROOT_URL = "https://api.fallenlondon.com/api";

export class FLApiClient {
    private authToken: string = "";
    private apiInterceptor = FLApiInterceptor.getInstance();

    constructor() {
        this.authToken = localStorage.access_token || sessionStorage.access_token || "";
        this.apiInterceptor.onTokenChanged((_, newToken) => {
            this.authToken = newToken;
        });
    }

    private callApi(method: string, uri: string, requestData: any): Promise<any> {
        const args = {
            method: method,
            headers: {
                Authorization: `Bearer ${this.authToken}`,
                "Content-Type": "application/json",
            },
        };

        if (method === "POST") {
            // @ts-ignore: I don't know how to make TS happy here
            args.body = JSON.stringify(requestData);
        }

        const promise = fetch(`${API_ROOT_URL}${uri}`, args);

        return promise.then((response) => {
            return response.json();
        });
    }

    public shareToProfile(contentKey: number, image?: string): Promise<any> {
        return this.callApi("POST", "/profile/share", {
            contentClass: "EventConclusion",
            contentKey: contentKey,
            image: image ?? "snowflake",
            message: "Hello, world!",
        });
    }

    public myself() {
        return this.callApi("GET", "/character/myself", {});
    }

    public goBack() {
        return this.callApi("POST", "/storylet/goback", {});
    }

    public getStorylet() {
        return this.callApi("POST", "/storylet", {})
    }

    public chooseBranch(branchId: number) {
        return this.callApi("POST", "/storylet/choosebranch", {
            branchId: branchId,
            secondChanceIds: [],
        })
    }

    public beginStorylet(storyletId: number) {
        return this.callApi("POST", "/storylet/begin", {
            eventId: storyletId,
        })
    }

}
