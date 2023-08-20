import { FLApiInterceptor } from "./api_interceptor.js";

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
        const promise = fetch(`${API_ROOT_URL}${uri}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${this.authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        return promise.then((response) => response.json())
    }

    public shareToProfile(contentKey: number, image?: string): Promise<any> {
        return this.callApi("POST", "/profile/share", {
            contentClass: "EventConclusion",
            contentKey: contentKey,
            image: image ?? "snowflake",
            message: "Hello, world!",
        })
    }
}
