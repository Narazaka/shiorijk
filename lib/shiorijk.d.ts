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
      constructor(options: {no_prepare: boolean});
      /**
       * @returns SHIORI Request Message string
       */
      toString(): string;
    }
    export class Response{
      status_line: StatusLine;
      headers: Headers.Response;
      constructor(options: {no_prepare: boolean});
      toString(): string;
    }
  }
  
  export class RequestLine{
    method: string;
    protocol: string;
    version: string;
    constructor();
    validate_method_version(method: string, version: number): void;
    toString(): string;
  }
  
  export class StatusLine{
    code: number;
    protocol: string;
    version: string;
    message: {[code: number]: string};
    constructor();
    toString(): string;
  }
  
  export class Headers{
    header: {[name: string]: string};
    constructor();
    get(name: string): string;
    set(name: string, value: string): string;
    get_separated(name: string, separator?: string): string[];
    set_separated(name: string, value: string[], separator?: string): string;
    get_separated2(name: string, separator1?: string, separator2?: string): string[][];
    set_separated2(name: string, value: string[][], separator1?: string, separator2?: string): string;
    validate(): void;
    toString(): string;
  }
  
  export namespace Headers{
    export class Request extends Headers{ }
    export class Response extends Headers{ }
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
