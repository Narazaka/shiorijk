/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 */
declare module ShioriJK{
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
      constructor(options?: {request_line?: RequestLine | {method?: string | null, protocol?: string | null, version?: string | null}, headers?: Headers.Request | {[name: string]: string}, no_prepare?: boolean});
      /**
       * @returns SHIORI Request Message string
       */
      toString(): string;
    }
    export class Response{
      status_line: StatusLine;
      headers: Headers.Response;
      constructor(options?: {status_line?: StatusLine | {code?: number | null, protocol?: string | null, version?: string | null}, headers?: Headers.Response | {[name: string]: string}, no_prepare?: boolean});
      toString(): string;
    }
  }

  export class RequestLine{
    method: string | null;
    protocol: string | null;
    version: string | null;
    constructor(properties?: {method?: string | null, protocol?: string | null, version?: string | null});
    validate_method_version(method: string, version: number): void;
    toString(): string;
  }

  export class StatusLine{
    code: number | null;
    protocol: string | null;
    version: string | null;
    message: {[code: number]: string};
    constructor(properties?: {code?: number | null, protocol?: string | null, version?: string | null});
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
    export class Parser{
      is_parsing(): boolean;
      is_parsing_end(): boolean;
      get_result(): any;
      begin_parse(): void;
      end_parse(): void;
      abort_parse(): void;
      parse(transaction: string): any;
      parse_chunk(chunk: string): any[];
      parse_lines(lines: string[]): {results: any[], state: string };
      parse_line(line: string): {results: any, state: string};
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
      export class Parser extends Shiori.Parser{ }
      export class Section extends Shiori.Section{ }
    }

    export namespace Request{
      export class Parser extends Shiori.Parser{
        parse(transaction: string): Message.Request;
      }
      export class Section extends Shiori.Section{ }

      export namespace RequestLine{
        export class Parser{
          constructor();
          parse(transaction: string): any[];
          parse_chunk(chunk: string): any[];
          parse_line(line: string): {results: any, state: string};
        }
      }

      export namespace Header{
        export class Parser extends Shiori.Header.Parser{ }
        export class Section extends Shiori.Header.Section{ }
      }
    }

    export namespace Response{
      export class Parser extends Shiori.Parser{
        parse(transaction: string): Message.Response;
      }
      export class Section extends Shiori.Section{ }

      export namespace StatusLine{
        export class Parser{
          constructor();
          parse(transaction: string): any[];
          parse_chunk(chunk: string): any[];
          parse_line(line: string): {results: any, state: string};
        }
      }

      export namespace Header{
        export class Parser extends Shiori.Header.Parser{ }
        export class Section extends Shiori.Header.Section{ }
      }
    }
  }
}

declare module "shiorijk" {
  export = ShioriJK;
}
