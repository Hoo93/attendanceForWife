import BaseApiClient, { Tokens } from './BaseApiClient';

interface LoginData {
    username: string;
    password: string;
}

interface Register {
    username: string;
    password: string;
    name: string;
    mobileNumber: string;
    birthday: string;
    email: string;
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

    public userRegister = (request: Register) =>
        this.axios.request({
            method: 'POST',
            url: '/auth/signup',
            data: request,
        });
}

export default AuthApiClient;
