import BaseApiClient, { Tokens } from './BaseApiClient';

interface LoginData {
    username: string;
    password: string;
}

class AuthApiClient extends BaseApiClient {
    private static instance: AuthApiClient;

    public constructor(tokens?: Tokens) {
        super(process.env.NEXT_PUBLIC_API_ROOT!, tokens);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AuthApiClient();
        }
        return this.instance;
    }

    public userLogin = (request: LoginData) =>
        this.axios.request({
            method: 'POST',
            url: '/auth/signin',
            data: request,
        });
}

export default AuthApiClient;
