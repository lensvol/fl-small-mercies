type AjaxMethod = (method: string, url: string, async: boolean) => any;

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
    private responseListeners: Map<string, ((request: any, response: any) => any)[]> = new Map();
    private requestListeners: Map<string, ((request: any) => any)[]> = new Map();

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

    private installOpenBypass(original_function: AjaxMethod, handler: (uri: string, request: any, responseText: string) => any): AjaxMethod {
        return function (method, url, async) {
            // @ts-ignore
            this._targetUrl = url;
            // @ts-ignore
            this.addEventListener("readystatechange", (event) => {
                // @ts-ignore
                if (this.readyState == DONE) {
                    // FIXME: also filter out non-200 responses
                    // @ts-ignore
                    const responseText = handler(url, this._requestData, event.currentTarget.responseText);
                    // @ts-ignore
                    Object.defineProperty(this, "responseText", {writable: true});
                    // @ts-ignore
                    this.responseText = responseText;
                }
            });
            // @ts-ignore
            return original_function.apply(this, arguments);
        };
    }

    private installSendBypass(original_function: AjaxMethod, handler: (fullUrl: string, request: Object) => Object): AjaxMethod {
        return function (body) {
            // @ts-ignore
            if (!this._targetUrl.includes("api.fallenlondon.com")) {
                // @ts-ignore
                return original_function.apply(this, arguments);
            }

            // @ts-ignore
            this._requestData = JSON.parse(arguments[0]);

            // @ts-ignore
            const preparedResponse = handler(this._targetUrl, this._requestData);
            if (preparedResponse) {
                // @ts-ignore
                setFakeXhrResponse(this, 200, preparedResponse);
                return;
            }

            // FIXME: Only deserialize _changed_ request data
            // @ts-ignore
            arguments[0] = JSON.stringify(this._requestData);
            // @ts-ignore
            return original_function.apply(this, arguments);
        };
    }

    public install() {
        // @ts-ignore
        XMLHttpRequest.prototype.open = this.installOpenBypass(XMLHttpRequest.prototype.open, this.processResponse.bind(this));
        // @ts-ignore
        XMLHttpRequest.prototype.send = this.installSendBypass(XMLHttpRequest.prototype.send, this.processRequest.bind(this));
    }
}
