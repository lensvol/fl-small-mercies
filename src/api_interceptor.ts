type AjaxMethod = (method: string, url: string, async: boolean) => any

const DONE = 4;

export class FLApiInterceptor {
    private responseListeners: Map<string, ((response: any) => any)[]> = new Map();

    private processResponse(fullUrl: string, responseText: string): string {
        const url = new URL(fullUrl);

        if (!this.responseListeners.has(url.pathname)) {
            // Do not waste time deserializing things no one asked us to
            return responseText;
        }

        try {
            const originalResponse = JSON.parse(responseText);
            const modifiedResponse = this.triggerResponseListeners(url.pathname, originalResponse);
            return JSON.stringify(modifiedResponse);
        } catch (e) {
            console.error(e);
            console.error(`Received from ${url.pathname}:`, responseText);
            return responseText;
        }
    }

    public onResponseReceived(uri: string, handler: ((response: any) => void)) {
        if (!this.responseListeners.has(uri)) {
            this.responseListeners.set(uri, []);
        }

        this.responseListeners.get(uri)?.push(handler);
    }

    private triggerResponseListeners(uri: string, response: any): any {
        let resultingResponse = response;

        try {
            const listeners = this.responseListeners.get(uri) || [];
            for (const handler of listeners) {
                resultingResponse = handler(resultingResponse) || resultingResponse;
            }
        } catch (error) {
            console.error(`Error caught when running listener for ${uri}:`, error);
            return response;
        }
        return resultingResponse;
    }

    private installOpenBypass(original_function: AjaxMethod, handler: (uri: string, responseText: string) => any): AjaxMethod {
        return function (method, url, async) {
            // @ts-ignore
            this._targetUrl = url;
            // @ts-ignore
            this.addEventListener("readystatechange", (event) => {
                // @ts-ignore
                if (this.readyState == DONE) {
                    // FIXME: also filter out non-200 responses
                    const responseText = handler(url, event.currentTarget.responseText)
                    // @ts-ignore
                    Object.defineProperty(this, 'responseText', {writable: true});
                    // @ts-ignore
                    this.responseText = responseText;
                }
            });
            // @ts-ignore
            return original_function.apply(this, arguments);
        };
    }

    public install() {
        // @ts-ignore
        XMLHttpRequest.prototype.open = this.installOpenBypass(XMLHttpRequest.prototype.open, this.processResponse.bind(this));
    }
}