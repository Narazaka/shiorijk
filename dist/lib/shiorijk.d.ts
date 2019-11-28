/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 *
 * (C) 2014-2018 Narazaka : Licensed under The [Zlib License](https://narazaka.net/license/Zlib?2014-2018)
 */
/** SHIORI/2.x/3.x method */
export declare type Method = "GET" | "NOTIFY" | "GET Version" | "GET Sentence" | "GET Word" | "GET Status" | "TEACH" | "GET String" | "NOTIFY OwnerGhostName" | "NOTIFY OtherGhostName" | "TRANSLATE Sentence";
/** SHIORI protocol */
export declare type Protocol = "SHIORI";
/** SHIORI version */
export declare type Version = "2.0" | "2.2" | "2.3" | "2.4" | "2.5" | "2.6" | "3.0";
/**
 * SHIORI Protocol Message Container
 */
export declare namespace Message {
    /** Message Containers' option */
    interface Options {
        /** do not prepare default data by the constructor */
        no_prepare?: boolean;
    }
    /** SHIORI Request Message like data */
    interface RequestLike {
        /** request line */
        request_line?: RequestLine | RequestLineLike;
        /** request headers */
        headers?: Headers.Request | {
            [name: string]: string;
        };
    }
    /** SHIORI Request Message Container */
    class Request implements RequestLike {
        /**
         * RequestLine Container (ex. GET SHIORI/3.x)
         */
        request_line: RequestLine;
        /** Headers Container */
        headers: Headers.Request;
        /**
         * initialize request
         * @param data request like data and options
         */
        constructor(data?: RequestLike & Options);
        /**
         * Message to string
         * @return message string
         */
        toString(): string;
    }
    /** SHIORI Response Message like data */
    interface ResponseLike {
        /** status line */
        status_line?: StatusLine | StatusLineLike;
        /** response headers */
        headers?: Headers.Response | {
            [name: string]: string;
        };
    }
    /** SHIORI Response Message Container */
    class Response implements ResponseLike {
        /** StatusLine Container */
        status_line: StatusLine;
        /** Headers Container */
        headers: Headers.Response;
        /**
         * initialize response
         * @param data response like data and options
         */
        constructor(data?: ResponseLike & Options);
        /**
         * Message to string
         * @return message string
         */
        toString(): string;
    }
}
/** SHIORI Request Message's RequestLine like data */
export interface RequestLineLike {
    /** method */
    method?: Method;
    /** protocol (default = "SHIORI") */
    protocol?: Protocol;
    /** version */
    version?: Version;
}
/** SHIORI Request Message's RequestLine Container */
export declare class RequestLine implements RequestLineLike {
    private readonly arguments;
    /**
     * initialize request line
     * @param data request line like data
     */
    constructor(data?: RequestLineLike);
    /** request method */
    get method(): Method | undefined;
    set method(method: Method | undefined);
    /** protocol */
    get protocol(): Protocol | undefined;
    set protocol(protocol: Protocol | undefined);
    /** version */
    get version(): Version | undefined;
    set version(version: Version | undefined);
    /**
     * validate
     * @param method method
     * @param version version
     * @throw if invalid
     */
    validate_method_version(method: Method, version: Version): void;
    /**
     * Message to string
     * @return message string
     */
    toString(): string;
}
export declare namespace RequestLine {
    /** Invalid value error */
    class InvalidValueError extends Error {
    }
}
/** SHIORI Response Message's StatusLine like data */
export interface StatusLineLike {
    /** status code */
    code?: number;
    /** protocol (default = "SHIORI") */
    protocol?: Protocol;
    /** version */
    version?: Version;
}
/** SHIORI Response Message's StatusLine Container */
export declare class StatusLine implements StatusLineLike {
    /** status messages for status codes */
    message: {
        [code: number]: string;
    };
    private readonly arguments;
    /**
     * initialize status line
     * @param data status line like data
     */
    constructor(data?: StatusLineLike);
    /** status code */
    get code(): number | undefined;
    set code(code: number | undefined);
    /** protocol */
    get protocol(): Protocol | undefined;
    set protocol(protocol: Protocol | undefined);
    /** version */
    get version(): Version | undefined;
    set version(version: Version | undefined);
    /**
     * Message to string
     * @return message string
     */
    toString(): string;
}
export declare namespace StatusLine {
    /** Invalid value error */
    class InvalidValueError extends Error {
    }
}
/** SHIORI Message Headers Container */
export declare class Headers {
    /** headers */
    header: {
        [name: string]: string | undefined;
    };
    /**
     * initialize headers
     * @param header headers
     */
    constructor(header?: {
        [name: string]: string;
    });
    /**
     * get header
     * @param name header name
     * @return header value
     */
    get(name: string): string | undefined;
    /**
     * set header
     *
     * header will be deleted if value == undefined
     * @param name header name
     * @param value header value
     * @return header value
     */
    set(name: string, value: string | undefined): string | undefined;
    /**
     * get header separated by \x01 or some as an array
     * @param name header name
     * @param separator separator characters
     * @return header values
     */
    get_separated(name: string, separator?: string): string[] | undefined;
    /**
     * set header separated by \x01 or some as an array
     * @param name header name
     * @param value header values
     * @param separator separator characters
     * @return header value
     */
    set_separated(name: string, value: string[], separator?: string): string;
    /**
     * get header separated by \x02 and \x01 or some as an array
     * @param name header name
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    get_separated2(name: string, separator1?: string, separator2?: string): string[][] | undefined;
    /**
     * set header separated by \x02 and \x01 or some as an array
     * @param name header name
     * @param value header values
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header value
     */
    set_separated2(name: string, value: string[][], separator1?: string, separator2?: string): string;
    /**
     * get Reference* headers
     * @return Reference* header values
     */
    references(): (string | undefined)[];
    /**
     * check that headers are line feed free
     * @throw if not
     */
    validate(): void;
    /**
     * Message to string
     * @return message string
     */
    toString(): string;
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @return header value
     */
    Reference(index: number): string | undefined;
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @param separator separator characters
     * @return header values
     */
    ReferenceSeparated(index: number, separator?: string): string[];
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    ReferenceSeparated2(index: number, separator1?: string, separator2?: string): string[][];
}
export declare namespace Headers {
    /** Invalid value error */
    class InvalidValueError extends Error {
    }
    /** SHIORI Request Message Headers Container */
    class Request extends Headers {
        /** Charset header */
        get Charset(): string | undefined;
        set Charset(value: string | undefined);
        /** Sender header */
        get Sender(): string | undefined;
        set Sender(value: string | undefined);
        /** SecurityLevel header (SHIORI/2.2,2.6,3.x) */
        get SecurityLevel(): string | undefined;
        set SecurityLevel(value: string | undefined);
        /** ID header (SHIORI/2.5,3.x) */
        get ID(): string | undefined;
        set ID(value: string | undefined);
        /** Event header (SHIORI/2.2) */
        get Event(): string | undefined;
        set Event(value: string | undefined);
        /** Type header (GET Word SHIORI/2.0) */
        get Type(): string | undefined;
        set Type(value: string | undefined);
        /** Status header (SHIORI/3.1) */
        get Status(): string[];
        set Status(value: string[]);
        /** Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3) */
        get Ghost(): string | undefined;
        set Ghost(value: string | undefined);
        /** Sentence header (SHIORI/2.0,2.3b) */
        get Sentence(): string | undefined;
        set Sentence(value: string | undefined);
        /** To header (SHIORI/2.3b) */
        get To(): string | undefined;
        set To(value: string | undefined);
        /** Age header (SHIORI/2.3b) */
        get Age(): number | undefined;
        set Age(value: number | undefined);
        /** Surface header (SHIORI/2.3b) */
        get Surface(): number[];
        set Surface(value: number[]);
        /** Word header (TEACH SHIORI/2.4) */
        get Word(): string | undefined;
        set Word(value: string | undefined);
    }
    /** SHIORI Response Message Headers Container */
    class Response extends Headers {
        /**
         * String header (GET String SHIORI/2.5)
         * @param separator separator characters
         * @return header values
         */
        StringSeparated(separator?: string): string[];
        /**
         * set String header (GET String SHIORI/2.5)
         * @param value header values
         * @param separator separator characters
         * @return header value
         */
        setStringSeparated(value: string[], separator?: string): string;
        /**
         * String header (GET String SHIORI/2.5)
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header values
         */
        StringSeparated2(separator1?: string, separator2?: string): string[][];
        /**
         * set String header (GET String SHIORI/2.5)
         * @param value header values
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header value
         */
        setStringSeparated2(value: string[][], separator1?: string, separator2?: string): string;
        /**
         * Value header (GET SHIORI/3.0)
         * @param separator separator characters
         * @return header values
         */
        ValueSeparated(separator?: string): string[];
        /**
         * set Value header (GET SHIORI/3.0)
         * @param value header values
         * @param separator separator characters
         * @return header value
         */
        setValueSeparated(value: string[], separator?: string): string;
        /**
         * Value header (GET SHIORI/3.0)
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header values
         */
        ValueSeparated2(separator1?: string, separator2?: string): string[][];
        /**
         * set Value header (GET SHIORI/3.0)
         * @param value header values
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header values
         */
        setValueSeparated2(value: string[][], separator1?: string, separator2?: string): string;
        /** BalloonOffset header (SHIORI/2.0) */
        get BalloonOffset(): number[][];
        set BalloonOffset(value: number[][]);
        /** Surface header (SHIORI/2.3b) */
        get Surface(): number[];
        set Surface(value: number[]);
        /** Sentence header (SHIORI/2.0,2.2,2.3b,2.4) */
        get Sentence(): string | undefined;
        set Sentence(value: string | undefined);
        /** Word header (GET Word SHIORI/2.0) */
        get Word(): string | undefined;
        set Word(value: string | undefined);
        /** Status header (GET Status SHIORI/2.0) */
        get Status(): number[];
        set Status(value: number[]);
        /** String header (GET String SHIORI/2.5) */
        get String(): string | undefined;
        set String(value: string | undefined);
        /** Value header (GET SHIORI/3.0) */
        get Value(): string | undefined;
        set Value(value: string | undefined);
    }
}
export declare namespace Shiori {
    /** Parse error */
    class ParseError extends Error {
    }
    /** parser base class */
    abstract class Parser<Container> {
        section: Section<string>;
        result: Container;
        parsers: {
            [name: string]: {
                abort_parse?(): void;
            };
        };
        is_parsing(): boolean;
        is_parsing_end(): boolean;
        /**
         * get parser result
         * @return result
         */
        get_result(): Container;
        /**
         * build result container
         * @return empty result container
         */
        abstract result_builder(): Container;
        /**
         * set section state to first section
         * @throw if before section != 'idle'
         * @return section index
         */
        begin_parse(): number;
        /**
         * set section state to begining section
         * @throw if before section != 'end'
         * @return section index
         */
        end_parse(): number;
        /**
         * set section state to begining section FORCE!
         *
         * @note recursively abort parsing
         * @return section index
         */
        abort_parse(): number;
        /**
         * parse a transaction
         * @param transaction complete transaction
         * @return parse_chunk()'s one result
         * @throw if transaction is not complete
         */
        parse(transaction: string): Container;
        /**
         * parse transaction chunk
         * @param chunk transaction chunk
         * @return parse_lines()'s results
         */
        parse_chunk(chunk: string): {
            results: Container[];
            state: "end" | "continue";
        };
        /**
         * parse chunk lines
         * @param lines transaction chunk separated by \r\n
         * @return results: parse_line()'s result, state: parser state
         */
        parse_lines(lines: string[]): {
            results: Container[];
            state: "end" | "continue";
        };
        /**
         * parse line
         * @param line transaction line separated by \r\n
         * @return results: result (if state is end), state: parser state
         */
        parse_line(line: string): {
            result?: undefined;
            state: "continue";
        } | {
            result: Container;
            state: "end";
        };
        /**
         * parser main routine
         */
        abstract parse_main(line: string): void;
    }
    /** parser section state manager */
    class Section<S extends string> {
        readonly sections: S[];
        private index;
        constructor(sections: S[]);
        is(section: S): boolean;
        next(): number;
        previous(): number;
        set(section: S): number;
        get(): S;
    }
    namespace Header {
        abstract class Parser<Container extends Headers> extends Shiori.Parser<Container> {
            parse_main(line: string): void;
            parse_header(line: string): {
                state: string;
            };
        }
        class Section extends Shiori.Section<"idle" | "header" | "end"> {
            constructor(sections?: ["idle", "header", "end"]);
        }
    }
    namespace Request {
        /** SHIORI Request parser */
        class Parser extends Shiori.Parser<Message.Request> {
            parsers: {
                request_line: RequestLine.Parser;
                headers: Header.Parser;
            };
            section: Section;
            result_builder(): Message.Request;
            parse_main(line: string): void;
        }
        namespace RequestLine {
            class Parser {
                result: RequestLine;
                result_builder(): RequestLine;
                parse(transaction: string): {
                    result: RequestLine;
                    state: "end";
                };
                parse_chunk(chunk: string): {
                    result: RequestLine;
                    state: "end";
                };
                parse_line(line: string): {
                    result: RequestLine;
                    state: "end";
                };
                abort_parse(): void;
            }
        }
        namespace Header {
            class Parser extends Shiori.Header.Parser<Headers.Request> {
                constructor();
                result_builder(): Headers.Request;
            }
            class Section extends Shiori.Header.Section {
            }
        }
        class Section extends Shiori.Section<"idle" | "request_line" | "headers" | "end"> {
            constructor(sections?: ["idle", "request_line", "headers", "end"]);
        }
    }
    namespace Response {
        /** SHIORI Response parser */
        class Parser extends Shiori.Parser<Message.Response> {
            parsers: {
                status_line: StatusLine.Parser;
                headers: Header.Parser;
            };
            section: Section;
            result_builder(): Message.Response;
            parse_main(line: string): void;
        }
        namespace StatusLine {
            class Parser {
                result: StatusLine;
                result_builder(): StatusLine;
                parse(transaction: string): {
                    result: StatusLine;
                    state: "end";
                };
                parse_chunk(chunk: string): {
                    result: StatusLine;
                    state: "end";
                };
                parse_line(line: string): {
                    result: StatusLine;
                    state: "end";
                };
                abort_parse(): void;
            }
        }
        namespace Header {
            class Parser extends Shiori.Header.Parser<Headers.Response> {
                constructor();
                result_builder(): Headers.Response;
            }
            class Section extends Shiori.Header.Section {
            }
        }
        class Section extends Shiori.Section<"idle" | "status_line" | "headers" | "end"> {
            constructor(sections?: ["idle", "status_line", "headers", "end"]);
        }
    }
}
