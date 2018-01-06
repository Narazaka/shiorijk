/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 */

/** SHIORI/2.x/3.x method */
export type Method =
  'GET' |
  'NOTIFY' |
  'GET Version' |
  'GET Sentence' |
  'GET Word' |
  'GET Status' |
  'TEACH' |
  'GET String' |
  'NOTIFY OwnerGhostName' |
  'NOTIFY OtherGhostName' |
  'TRANSLATE Sentence';

/** SHIORI protocol */
export type Protocol = 'SHIORI';

/** SHIORI version */
export type Version = '2.0' | '2.2' | '2.3' | '2.4' | '2.5' | '2.6' | '3.0';

/**
 * SHIORI Protocol Message Container
 */
export namespace Message{
  /**
   * SHIORI Request Container
   */
  export class Request{
    /**
     * request line (ex. GET SHIORI/3.x)
     */
    request_line: RequestLine;
    /** request headers */
    headers: Headers.Request;
    /**
     * @param options options
     */
    constructor(options?: {request_line?: RequestLine | {method?: Method | null, protocol?: Protocol | null, version?: Version | null}, headers?: Headers.Request | {[name: string]: string}, no_prepare?: boolean});
    /**
     * @returns SHIORI Request Message string
     */
    toString(): string;
  }
  export class Response{
    status_line: StatusLine;
    headers: Headers.Response;
    constructor(options?: {status_line?: StatusLine | {code?: number | null, protocol?: Protocol | null, version?: Version | null}, headers?: Headers.Response | {[name: string]: string}, no_prepare?: boolean});
    toString(): string;
  }
}

export class RequestLine{
  method?: Method | null;
  protocol?: Protocol | null;
  version?: Version | null;
  constructor(properties?: {method?: Method | null, protocol?: Protocol | null, version?: Version | null});
  validate_method_version(method: Method, version: Version): void;
  toString(): string;
}

export class StatusLine{
  code?: number | null;
  protocol?: Protocol | null;
  version?: Version | null;
  message: {[code: number]: string};
  constructor(properties?: {code?: number | null, protocol?: Protocol | null, version?: Version | null});
  toString(): string;
}

export class Headers{
  header: {[name: string]: string};
  constructor(header?: {[name: string]: string});
  get(name: string): string | undefined;
  set(name: string, value: string): string;
  get_separated(name: string, separator?: string): string[];
  set_separated(name: string, value: string[], separator?: string): string;
  get_separated2(name: string, separator1?: string, separator2?: string): string[][];
  set_separated2(name: string, value: string[][], separator1?: string, separator2?: string): string;
  references(): (string | undefined)[];
  validate(): void;
  toString(): string;
  Reference(index: number): string | undefined;
  ReferenceSeparated(index: number, separator?: string): string[];
  ReferenceSeparated2(index: number, separator1?: string, separator2?: string): string[][];
}

export namespace Headers{
  export class Request extends Headers{
    Charset?: string;
    Sender?: string;
    SecurityLevel?: string;
    ID?: string;
    Event?: string;
    Type?: string;
    Status: string[];
    Ghost?: string;
    Sentence?: string;
    To?: string;
    Age?: number;
    Surface: number[];
    Word?: string;
  }

  export class Response extends Headers{
    BalloonOffset: number[][];
    Surface: number[];
    Sentence?: string;
    Word?: string;
    Status: number[];
    String?: string;
    StringSeparated(separator?: string): string[];
    StringSeparated2(separator1?: string, separator2?: string): string[][];
    Value?: string;
    ValueSeparated(separator?: string): string[];
    ValueSeparated2(separator1?: string, separator2?: string): string[][];
  }
}

export namespace Shiori{
  export class Parser<Container>{
    is_parsing(): boolean;
    is_parsing_end(): boolean;
    get_result(): Container;
    begin_parse(): void;
    end_parse(): void;
    abort_parse(): void;
    parse(transaction: string): Container;
    parse_chunk(chunk: string): {results: Container[], state: "continue" | "end" };
    parse_lines(lines: string[]): {results: Container[], state: "continue" | "end" };
    parse_line(line: string): {result?: undefined, state: "continue"};
    parse_line(line: string): {result: Container, state: "end"};
    parse_main(line: string): void;
  }

  export class Section{
    constructor(sections: string[]);
    is(section: string): boolean;
    next(): number;
    previous(): number;
    set(section: string): number;
    get(): string;
  }

  export namespace Header{
    export class Parser<Container extends Headers> extends Shiori.Parser<Container>{ }
    export class Section extends Shiori.Section{ }
  }

  export namespace Request{
    export class Parser extends Shiori.Parser<Message.Request>{ }
    export class Section extends Shiori.Section{ }

    export namespace RequestLine{
      export class Parser{
        constructor();
        parse(transaction: string): {results: RequestLine, state: "end"};
        parse_chunk(chunk: string): {results: RequestLine, state: "end"};
        parse_line(line: string): {results: RequestLine, state: "end"};
      }
    }

    export namespace Header{
      export class Parser extends Shiori.Header.Parser<Headers.Request>{ }
      export class Section extends Shiori.Header.Section{ }
    }
  }

  export namespace Response{
    export class Parser extends Shiori.Parser<Message.Response>{ }
    export class Section extends Shiori.Section{ }

    export namespace StatusLine{
      export class Parser{
        constructor();
        parse(transaction: string): {results: StatusLine, state: "end"};
        parse_chunk(chunk: string): {results: StatusLine, state: "end"};
        parse_line(line: string): {results: StatusLine, state: "end"};
      }
    }

    export namespace Header{
      export class Parser extends Shiori.Header.Parser<Headers.Response>{ }
      export class Section extends Shiori.Header.Section{ }
    }
  }
}
