import { IUserResponse } from "./interfaces.js";

type AjaxMethod = (method: string, url: string, async: boolean) => any;

interface IModifiedAjax {
    _requestData: Record<string, unknown>,
    _targetUrl: string,
}

type AugmentedXMLHttpRequest = XMLHttpRequest & IModifiedAjax;

const DONE = 4;

function setFakeXhrResponse(request: any, status: number, response: object) {
    Object.defineProperty(request, "responseText", {writable: true});
    Object.defineProperty(request, "readyState", {writable: true});
    Object.defineProperty(request, "status", {writable: true});

    request.responseText = JSON.stringify(response);
    request.readyState = DONE;
    request.status = status;

    request.onreadystatechange();
}

export class FLApiInterceptor {
    private static instance: FLApiInterceptor;

    private constructor() { }

    public static getInstance(): FLApiInterceptor {
        if (!FLApiInterceptor.instance) {
            FLApiInterceptor.instance = new FLApiInterceptor();
        }

        return FLApiInterceptor.instance;
    }

    private currentToken = "";
    private responseListeners: Map<string, ((request: any, response: any) => any)[]> = new Map();
    private requestListeners: Map<string, ((request: any) => any)[]> = new Map();
    private tokenChangeListeners: ((oldToken: string, newToken: string) => void)[] = [];

    private processRequest(fullUrl: string, originalRequest: any): any | null {
        const url = new URL(fullUrl);

        if (this.requestListeners.has(url.pathname)) {
            // Do not waste time deserializing things no one asked us to
            return this.triggerRequestListeners(url.pathname, originalRequest);
        }

        return null;
    }

    private processResponse(fullUrl: string, originalRequest: any, responseText: string): string {
        const url = new URL(fullUrl);

        if (!this.responseListeners.has(url.pathname)) {
            // Do not waste time deserializing things no one asked us to
            return responseText;
        }

        try {
            const originalResponse = JSON.parse(responseText);
            const modifiedResponse = this.triggerResponseListeners(url.pathname, originalRequest, originalResponse);
            return JSON.stringify(modifiedResponse);
        } catch (e) {
            console.error(e);
            console.error(`Received from ${url.pathname}:`, responseText);
            return responseText;
        }
    }

    public onResponseReceived(uri: string, handler: (request: any, response: any) => void) {
        if (!this.responseListeners.has(uri)) {
            this.responseListeners.set(uri, []);
        }

        this.responseListeners.get(uri)?.push(handler);
    }

    public onRequestSent(uri: string, handler: (request: any) => void) {
        if (!this.requestListeners.has(uri)) {
            this.requestListeners.set(uri, []);
        }

        this.requestListeners.get(uri)?.push(handler);
    }

    public onTokenChanged(handler: (oldToken: string, newToken: string) => void) {
        this.tokenChangeListeners.push(handler);
    }

    private triggerRequestListeners(uri: string, request: any): any {
        let fakeResponse = null;

        try {
            const listeners = this.requestListeners.get(uri) || [];
            for (const handler of listeners) {
                fakeResponse = handler(request);
                // Short-circuit if a listener returns a response
                if (fakeResponse) {
                    break;
                }
            }
        } catch (error) {
            console.error(`Error caught when running listener for ${uri}:`, error);
            return null;
        }
        return fakeResponse;
    }

    private triggerResponseListeners(uri: string, request: any, response: any): any {
        let resultingResponse = response;

        try {
            const listeners = this.responseListeners.get(uri) || [];
            for (const handler of listeners) {
                resultingResponse = handler(request, resultingResponse) || resultingResponse;
            }
        } catch (error) {
            console.error(`Error caught when running listener for ${uri}:`, error);
            return response;
        }
        return resultingResponse;
    }

    private triggerTokenChangeListeners(oldToken: string, newToken: string) {
        for (const handler of this.tokenChangeListeners) {
            handler(oldToken, newToken);
        }
    }

    private installOpenBypass(original_function: AjaxMethod, handler: (uri: string, request: any, responseText: string) => any): AjaxMethod {
        return function (this: AugmentedXMLHttpRequest, _method, url, _async) {
            // @ts-ignore: There is hell and then there is typing other people's API.
            this._targetUrl = url;
            // @ts-ignore: There is hell and then there is typing other people's API.
            this.addEventListener("readystatechange", (event) => {
                // @ts-ignore: There is hell and then there is typing other people's API.
                if (this.readyState == DONE) {
                    // FIXME: also filter out non-200 responses
                    // @ts-ignore: There is hell and then there is typing other people's API.
                    const responseText = handler(url, this._requestData, event.currentTarget.responseText);
                    // @ts-ignore: There is hell and then there is typing other people's API.
                    Object.defineProperty(this, "responseText", {writable: true});
                    // @ts-ignore: There is hell and then there is typing other people's API.
                    // noinspection JSConstantReassignment
                    this.responseText = responseText;
                }
            });
            return original_function.apply(this, [_method, url, _async]);
        };
    }

    private installSendBypass(original_function: AjaxMethod, handler: (fullUrl: string, request: Record<string, unknown>) => Record<string, unknown>): AjaxMethod {
        return function (this: AugmentedXMLHttpRequest,...args) {
            if (!this._targetUrl.includes("api.fallenlondon.com")) {
                return original_function.apply(this, args);
            }

            this._requestData = JSON.parse(args[0] ?? null);

            const preparedResponse = handler(this._targetUrl, this._requestData);
            if (preparedResponse) {
                setFakeXhrResponse(this, 200, preparedResponse);
                return;
            }

            // FIXME: Only deserialize _changed_ request data
            if (this._requestData != null) {
                args[0] = JSON.stringify(this._requestData);
            }
            return original_function.apply(this, args);
        };
    }

    public install() {
        // @ts-ignore: There is hell and then there is typing other people's API.
        XMLHttpRequest.prototype.open = this.installOpenBypass(XMLHttpRequest.prototype.open, this.processResponse.bind(this));
        // @ts-ignore: There is hell and then there is typing other people's API.
        XMLHttpRequest.prototype.send = this.installSendBypass(XMLHttpRequest.prototype.send, this.processRequest.bind(this));

        // Acquire token stored by FL UI itself
        this.currentToken = localStorage.access_token || sessionStorage.access_token || "";

        this.onResponseReceived("/api/login/user", this.refreshUserToken.bind(this));
        this.onResponseReceived("/api/login", this.refreshUserToken.bind(this));
    }

    private refreshUserToken(_request: any, response: IUserResponse): IUserResponse {
        if (this.currentToken !== response.jwt) {
            const oldToken = this.currentToken;
            this.currentToken = response.jwt;

            this.triggerTokenChangeListeners(oldToken, this.currentToken);
        }

        return response;
    }
}
