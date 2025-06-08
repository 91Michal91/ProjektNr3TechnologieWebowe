import { AuthResponse, TodoApiBase, UserCredentials } from "./TodoApiBase";

export class TodoApi extends TodoApiBase {
    authToken: string | null = null;

    constructor(url: string) {
        const http: unknown = {
            fetch: null
        }
        super(url, http as ApiHttpClient);
        (http as ApiHttpClient).fetch = this.fetchWrapper.bind(this)
    }

    override authenticate(body: UserCredentials): Promise<AuthResponse> {
        return super.authenticate(body).then(r => {
            this.authToken = r.token!
            return r;
        })
    }

    private fetchWrapper(url: RequestInfo, init?: RequestInit): Promise<Response> {
        const opts: RequestInit = {
            ...init,
        }

        if (this.authToken) {
            opts.headers = {
                ...opts.headers,
                'Authorization': `Bearer ${this.authToken}`
            }
        }

        return fetch(url, opts)
    }
}

type ApiHttpClient = { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }