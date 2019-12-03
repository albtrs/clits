export declare class ArgError extends Error {
    code: string;
    args: string[];
    constructor(code: string, args: string[]);
}
export declare const ERROR_MESSAGES: {
    E0001: string;
    E0002: string;
    E0003: string;
};
export declare function errorExit(error: ArgError): void;
