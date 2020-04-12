class Credentials {
    public username: string;
    public passwd: string;
};

class Configuration {
    public platformHost: string;
    public platformURL: string;
    public credentials: Credentials;
    public protocol: string;
};

export = Configuration;