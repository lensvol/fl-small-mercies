type AjaxMethod = (method: string, url: string, async: boolean) => any

const DONE = 4;

export class FLApiInterceptor {
    private responseListeners: Map<string, ((response: any) => void)[]> = new Map();

    private processResponse(fullUrl: string, responseText: string) {
        const url = new URL(fullUrl);

        if (!this.responseListeners.has(url.pathname)) {
            // Do not waste time deserializing things no one asked us to
            return;
        }

        try {
            const response = JSON.parse(responseText);
            this.triggerResponseListeners(url.pathname, response);
        } catch (e) {
            console.error(e);
            console.error(`Received from ${url.pathname}:`, responseText);
        }
    }

    public onResponseReceived(uri: string, handler: ((response: any) => void)) {
        if (!this.responseListeners.has(uri)) {
            this.responseListeners.set(uri, []);
        }

        this.responseListeners.get(uri)?.push(handler);
    }

    private triggerResponseListeners(uri: string, response: any): void {
        try {
            this.responseListeners.get(uri)?.map((handler) => handler(response))
        } catch (error) {
            console.error(`Error caught when running listener for ${uri}:`, error);
        }
    }

    private installOpenBypass(original_function: AjaxMethod, handler: (uri: string, responseText: string) => void): AjaxMethod {
        return function (method, url, async) {
            // @ts-ignore
            this._targetUrl = url;
            // @ts-ignore
            this.addEventListener("readystatechange", (event) => {
                // @ts-ignore
                if (this.readyState == DONE) {
                    // FIXME: also filter out non-200 responses
                    handler(url, event.currentTarget.responseText)
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