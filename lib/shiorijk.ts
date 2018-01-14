/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 *
 * (C) 2014-2018 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2018
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
export namespace Message {
  /** SHIORI Request Message Container */
  export class Request {
    /**
     * RequestLine Container (ex. GET SHIORI/3.x)
     */
    request_line: RequestLine;
    /** Headers Container */
    headers: Headers.Request;

    /**
     * initialize inner containers
     * @param request_line [Hash|ShioriJK.Requestline] request line
     * @param headers [Hash|ShioriJK.Headers.Request] request headers
     * @param no_prepare [Boolean] do not prepare default RequestLine and Headers by the constructor
     */
    constructor(properties: {request_line?: RequestLine | {method?: Method | null, protocol?: Protocol | null, version?: Version | null}, headers?: Headers.Request | {[name: string]: string}, no_prepare?: boolean} = {}) {
      const {request_line, headers, no_prepare} = properties;

      if (request_line == null) {
        if (!no_prepare) this.request_line = new RequestLine();
      } else {
        if (request_line instanceof RequestLine) {
          this.request_line = request_line;
        } else {
          this.request_line = new RequestLine(request_line);
        }
      }

      if (headers == null) {
        this.headers = new Headers.Request();
      } else {
        if (headers instanceof Headers.Request) {
          this.headers = headers;
        } else {
          this.headers = new Headers.Request(headers);
        }
      }
    }

    /**
     * Message to string
     * @return [String] message string
     */
    toString() {
      return this.request_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
    }

  }

  /** SHIORI Response Message Container */
  export class Response {
    /** StatusLine Container */
    status_line: StatusLine;

    /** [ShioriJK.Headers.Request] Headers Container */
    headers: Headers.Response;

    /**
     * initialize inner containers
     * @param status_line [Hash|ShioriJK.Statusline] status line
     * @param headers [Hash|ShioriJK.Headers.Response] response headers
     * @param no_prepare [Boolean] do not prepare default StatusLine and Headers by the constructor
     */
    constructor(properties: {status_line?: StatusLine | {code?: number | null, protocol?: Protocol | null, version?: Version | null}, headers?: Headers.Response | {[name: string]: string}, no_prepare?: boolean} = {}) {
      const {status_line, headers, no_prepare} = properties;

      if (status_line == null) {
        if (!no_prepare) this.status_line = new StatusLine();
      } else {
        if (status_line instanceof StatusLine) {
          this.status_line = status_line;
        } else {
          this.status_line = new StatusLine(status_line);
        }
      }

      if (headers == null) {
        this.headers = new Headers.Response();
      } else {
        if (headers instanceof Headers.Response) {
          this.headers = headers;
        } else {
          this.headers = new Headers.Response(headers);
        }
      }
    }

    /**
     * Message to string
     * @return [String] message string
     */
    toString() {
      return this.status_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
    }
  }
}

/** SHIORI Request Message's RequestLine Container */
export class RequestLine {
  private arguments: {method?: Method | null, protocol?: Protocol | null, version?: Version | null} = {};

  /**
   * initialize request line
   * @param method [string] method
   * @param protocol [string] protocol (default = 'SHIORI')
   * @param version [string] version
   */
  constructor(properties: {method?: Method | null, protocol?: Protocol | null, version?: Version | null} = {}) {
    const {method, protocol, version} = properties;
    if (method != null) {
      this.method = method;
    }
    this.protocol = protocol || 'SHIORI'; // for codo
    if (version != null) {
      this.version = version;
    }
  }

  /** request method */
  get method(): Method | null | undefined {
    return this.arguments.method;
  }

  set method(method) {
    if ((method != null) && (this.version != null)) {
      this.validate_method_version(method, this.version);
    } else if (method != null) {
      switch (method) {
        case 'GET':
        case 'NOTIFY':
        case 'GET Version':
        case 'GET Sentence':
        case 'GET Word':
        case 'GET Status':
        case 'TEACH':
        case 'GET String':
        case 'NOTIFY OwnerGhostName':
        case 'NOTIFY OtherGhostName':
        case 'TRANSLATE Sentence':
          break;
        default:
          throw 'Invalid protocol method : ' + method;
      }
    }
    this.arguments.method = method;
  }

  /** protocol */
  get protocol(): Protocol | null | undefined {
    return this.arguments.protocol;
  }

  set protocol(protocol) {
    if ((protocol != null) && protocol !== 'SHIORI') {
      throw 'Invalid protocol : ' + protocol;
    }
    this.arguments.protocol = protocol;
  }

  /** version */
  get version(): Version | null | undefined {
    return this.arguments.version;
  }

  set version(version) {
    if ((this.method != null) && (version != null)) {
      this.validate_method_version(this.method, version);
    } else if (version != null) {
      switch (version) {
        case '2.0':
        case '2.2':
        case '2.3':
        case '2.4':
        case '2.5':
        case '2.6':
        case '3.0':
          break;
        default:
          throw 'Invalid protocol version : ' + version;
      }
    }
    this.arguments.version = version;
  }

  /**
   * validate
   * @param method [String] method name == 'SHIORI'
   * @param version [Number] version
   * @throw [String] if invalid
   */
  validate_method_version(method: Method, version: Version) {
    let is_valid = false;
    switch (version) {
      case '2.0':
        switch (method) {
          case 'GET Version':
          case 'NOTIFY OwnerGhostName':
          case 'GET Sentence':
          case 'GET Word':
          case 'GET Status':
            is_valid = true;
        }
        break;
      case '2.2':
        switch (method) {
          case 'GET Sentence':
            is_valid = true;
        }
        break;
      case '2.3':
        switch (method) {
          case 'NOTIFY OtherGhostName':
          case 'GET Sentence':
            is_valid = true;
        }
        break;
      case '2.4':
        switch (method) {
          case 'TEACH':
            is_valid = true;
        }
        break;
      case '2.5':
        switch (method) {
          case 'GET String':
            is_valid = true;
        }
        break;
      case '2.6': // spec is unknown
        switch (method) {
          case 'GET Sentence':
          case 'GET Status':
          case 'GET String':
          case 'NOTIFY OwnerGhostName':
          case 'NOTIFY OtherGhostName':
          case 'GET Version':
          case 'TRANSLATE Sentence':
            is_valid = true;
        }
        break;
      case '3.0':
        switch (method) {
          case 'GET':
          case 'NOTIFY':
            is_valid = true;
        }
    }
    if (!is_valid) {
      throw 'Invalid protocol method and version : ' + method + ' SHIORI/' + version;
    }
  }

  /**
   * Message to string
   * @return [String] message string
   */
  toString() {
    return `${this.method} ${this.protocol}/${this.version}`;
  }
}

const RequestLineClass = RequestLine;

/** SHIORI Response Message's StatusLine Container */
export class StatusLine {
  /** status messages for status codes */
  message: {[code: number]: string};

  private arguments: {code?: number | null, protocol?: Protocol | null, version?: Version | null} = {};

  /**
   * initialize status line
   * @param code [number] status code
   * @param protocol [string] protocol (default = 'SHIORI')
   * @param version [string] version
   */
  constructor(properties: {code?: number | null, protocol?: Protocol | null, version?: Version | null} = {}) {
    const {code, protocol, version} = properties;
    if (code != null) {
      this.code = code;
    }
    this.protocol = protocol || 'SHIORI'; // for codo
    if (version != null) {
      this.version = version;
    }
  }

  /** status code */
  get code() {
    return this.arguments.code;
  }

  set code(code) {
    if ((code != null) && (this.message[code] == null)) {
      throw 'Invalid response code : ' + code;
    }
    this.arguments.code = code;
  }

  /** protocol */
  get protocol(): Protocol | null | undefined {
    return this.arguments.protocol;
  }

  set protocol(protocol) {
    if ((protocol != null) && protocol !== 'SHIORI') {
      throw 'Invalid protocol : ' + protocol;
    }
    this.arguments.protocol = protocol;
  }

  /** version */
  get version(): Version | null | undefined {
    return this.arguments.version;
  }

  set version(version) {
    if (version != null) {
      switch (version) {
        case '2.0':
        case '2.2':
        case '2.3':
        case '2.4':
        case '2.5':
        case '2.6':
        case '3.0':
          break;
        default:
          throw 'Invalid protocol version : ' + version;
      }
    }
    this.arguments.version = version;
  }

  /**
   * Message to string
   * @return [String] message string
   */
  toString() {
    return `${this.protocol}/${this.version} ${this.code} ${this.message[this.code as any]}`;
  }

}

StatusLine.prototype.message = {
  200: 'OK',
  204: 'No Content',
  310: 'Communicate',
  311: 'Not Enough',
  312: 'Advice',
  400: 'Bad Request',
  418: "I'm a tea pot",
  500: 'Internal Server Error'
};

const StatusLineClass = StatusLine;

/** SHIORI Message Headers Container */
export class Headers {
  /** headers */
  header: {[name: string]: string | undefined};

  /**
   * initialize headers
   * @param header [Hash<String, String>] headers
   */
  constructor(header: {[name: string]: string} = {}) {
    this.header = header;
  }

  /**
   * get header
   * @param name [String] header name
   * @return [String] header value
   */
  get(name: string) {
    return this.header[name];
  }

  /**
   * set header
   * @param name [String] header name
   * @param value [String] header value
   * @return [String] header value
   */
  set(name: string, value: string) {
    return this.header[name] = value;
  }

  /**
   * get header separated by \x01 or some as an array
   * @param name [String] header name
   * @param separator [String] separator characters
   * @return [Array<String>] header values
   */
  get_separated(name: string, separator = '\x01') {
    const value = this.header[name];
    if (value != null) {
      return value.split(separator);
    } else {
      return;
    }
  }

  /**
   * set header separated by \x01 or some as an array
   * @param name [String] header name
   * @param value [Array<String>] header values
   * @param separator [String] separator characters
   * @return [String] header value
   */
  set_separated(name: string, value: string[], separator = '\x01') {
    return this.header[name] = value.join(separator);
  }

  /**
   * get header separated by \x02 and \x01 or some as an array
   * @param name [String] header name
   * @param separator1 [String] first level separator characters
   * @param separator2 [String] second level separator characters
   * @return [Array<Array<String>>] header values
   */
  get_separated2(name: string, separator1 = '\x02', separator2 = '\x01') {
    const value = this.header[name];
    if (value != null) {
      return value.split(separator1).map((value1) => value1.split(separator2));
    } else {
      return;
    }
  }

  /**
   * set header separated by \x02 and \x01 or some as an array
   * @param name [String] header name
   * @param value [Array<Array<String>>] header values
   * @param separator1 [String] first level separator characters
   * @param separator2 [String] second level separator characters
   * @return [String] header value
   */
  set_separated2(name: string, value: string[][], separator1 = '\x02', separator2 = '\x01') {
    return this.header[name] = value.map((value1) => value1.join(separator2)).join(separator1);
  }

  /**
   * get Reference* headers
   * @return [Array<String | undefined>] Reference* header values
   */
  references() {
    let reference_max_index = -1;
    for (const name in this.header) {
      const result = /^Reference(\d+)$/.exec(name);
      if (result && reference_max_index < Number(result[1])) {
        reference_max_index = Number(result[1]);
      }
    }
    const references: Array<string | undefined> = new Array(reference_max_index + 1);
    for (let index = 0; index <= reference_max_index; ++index) {
      references[index] = this.header[`Reference${index}`];
    }

    return references;
  }

  /**
   * check that headers are line feed free
   * @throw [String] if not
   */
  validate() {
    for (const name in this.header) {
      const value = this.header[name];
      if (`${value}`.match(/\n/)) {
        throw 'Invalid header value - line feed found : [' + name + '] : ' + value;
      }
    }
  }

  /**
   * Message to string
   * @return [String] message string
   */
  toString() {
    this.validate();
    let str = '';
    for (const name in this.header) {
      const value = this.header[name];
      str += `${name}: ${value}\r\n`;
    }
    return str;
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index [Number] reference index
   * @return [String] header value
   */
  Reference(index: number) {
    return this.get(`Reference${index}`);
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index [Number] reference index
   * @param separator [String] separator characters
   * @return [Array<String>] header values
   */
  ReferenceSeparated(index: number, separator = '\x01') {
    return this.get_separated(`Reference${index}`, separator) || [];
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index [Number] reference index
   * @param separator1 [String] first level separator characters
   * @param separator2 [String] second level separator characters
   * @return [Array<Array<String>>] header values
   */
  ReferenceSeparated2(index: number, separator1 = '\x02', separator2 = '\x01') {
    return this.get_separated2(`Reference${index}`, separator1, separator2) || [];
  }

}

export namespace Headers {
  /** SHIORI Request Message Headers Container */
  export class Request extends Headers {
    /** Charset header */
    get Charset() {
      return this.get("Charset");
    }

    /** Sender header */
    get Sender() {
      return this.get("Sender");
    }

    /** SecurityLevel header (SHIORI/2.2,2.6,3.x) */
    get SecurityLevel() {
      return this.get("SecurityLevel");
    }

    /** ID header (SHIORI/2.5,3.x) */
    get ID() {
      return this.get("ID");
    }

    /** Event header (SHIORI/2.2) */
    get Event() {
      return this.get("Event");
    }

    /** Type header (GET Word SHIORI/2.0) */
    get Type() {
      return this.get("Type");
    }

    /** Status header (SHIORI/3.1) */
    get Status() {
      return (this.get_separated("Status", ",")) || [];
    }

    /** Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3) */
    get Ghost() {
      return this.get("Ghost");
    }

    /** Sentence header (SHIORI/2.0,2.3b) */
    get Sentence() {
      return this.get("Sentence");
    }

    /** To header (SHIORI/2.3b) */
    get To() {
      return this.get("To");
    }

    /** Age header (SHIORI/2.3b) */
    get Age() {
      const age = this.get("Age");

      return age == null ? undefined : Number(age);
    }

    /** Surface header (SHIORI/2.3b) */
    get Surface() {
      return (this.get_separated("Surface", ",") || []).map((value1) => Number(value1));
    }

    /** Word header (TEACH SHIORI/2.4) */
    get Word() {
      return this.get("Word");
    }
  }

  /** SHIORI Response Message Headers Container */
  export class Response extends Headers {
    /**
     * String header (GET String SHIORI/2.5)
     * @param separator [String] separator characters
     * @return [Array<String>] header values
     */
    StringSeparated(separator = '\x01') {
      return this.get_separated("String", separator) || [];
    }

    /**
     * String header (GET String SHIORI/2.5)
     * @param separator1 [String] first level separator characters
     * @param separator2 [String] second level separator characters
     * @return [Array<Array<String>>] header values
     */
    StringSeparated2(separator1 = '\x02', separator2 = '\x01') {
      return this.get_separated2("String", separator1, separator2) || [];
    }

    /**
     * Value header (GET SHIORI/3.0)
     * @param separator [String] separator characters
     * @return [Array<String>] header values
     */
    ValueSeparated(separator = '\x01') {
      return this.get_separated("Value", separator) || [];
    }

    /**
     * Value header (GET SHIORI/3.0)
     * @param separator1 [String] first level separator characters
     * @param separator2 [String] second level separator characters
     * @return [Array<Array<String>>] header values
     */
    ValueSeparated2(separator1 = '\x02', separator2 = '\x01') {
      return this.get_separated2("Value", separator1, separator2) || [];
    }

    /** BalloonOffset header (SHIORI/2.0) */
    get BalloonOffset() {
      return (this.get_separated2("BalloonOffset", ",") || []).map((value1) => value1.map((value2) => Number(value2)));
    }

    /** Surface header (SHIORI/2.3b) */
    get Surface() {
      return (this.get_separated("Surface", ",") || []).map((value1) => Number(value1));
    }

    /** Sentence header (SHIORI/2.0,2.2,2.3b,2.4) */
    get Sentence() {
      return this.get("Sentence");
    }

    /** Word header (GET Word SHIORI/2.0) */
    get Word() {
      return this.get("Word");
    }

    /** Status header (GET Status SHIORI/2.0) */
    get Status() {
      return (this.get_separated("Status", ",") || []).map((value1) => Number(value1));
    }

    /** String header (GET String SHIORI/2.5) */
    get String() {
      return this.get("String");
    }

    /** Value header (GET SHIORI/3.0) */
    get Value() {
      return this.get("Value");
    }
  }
}

export namespace Shiori {
  /** parser base class */
  export abstract class Parser<Container> {
    section: Section;
    result: Container;
    parsers: {[name: string]: {abort_parse?(): void}};

    // @return [Boolean]
    is_parsing() {
      return !this.section.is('idle');
    }

    // @return [Boolean]
    is_parsing_end() {
      return !this.section.is('end');
    }

    // get parser result
    // @return result
    get_result() {
      return this.result;
    }

    // build result container
    // @abstract used by subclasses
    // @return empty result container
    abstract result_builder(): Container;

    // set section state to first section
    // @throw [String] if before section != 'idle'
    begin_parse() {
      if (!this.section.is('idle')) {
        throw 'cannot begin parsing because previous transaction is still working';
      }
      this.result = this.result_builder();
      return this.section.next();
    }

    // set section state to begining section
    // @throw [String] if before section != 'end'
    end_parse() {
      if (!this.section.is('end')) {
        this.abort_parse();
        throw 'parsing was aborted';
      }
      return this.section.next();
    }

    // set section state to begining section FORCE!
    // @note recursively abort parsing
    abort_parse() {
      if (this.parsers != null) {
        for (const name in this.parsers) {
          const parser = this.parsers[name];
          if (parser.abort_parse != null) {
            parser.abort_parse();
          }
        }
      }
      return this.section.set('idle');
    }

    // parse a transaction
    // @param transaction [String] complete transaction
    // @return parse_chunk()'s one result
    // @throw [String] if transaction is not complete
    parse(transaction: string) {
      this.begin_parse();
      const result = this.parse_chunk(transaction);
      if (this.is_parsing()) {
        throw 'transaction is not closed';
      }
      if (result.results.length !== 1) {
        throw 'multiple transaction';
      }
      return result.results[0];
    }

    // parse transaction chunk
    // @param chunk [String] transaction chunk
    // @return [Hash] parse_lines()'s results
    parse_chunk(chunk: string) {
      const lines = chunk.split(/\r\n/);
      if (chunk.match(/\r\n$/)) {
        lines.pop();
      }
      return this.parse_lines(lines);
    }

    // parse chunk lines
    // @param lines [Array<String>] transaction chunk separated by \r\n
    // @return [Hash] {results: parse_line()'s result, state: parser state}
    parse_lines(lines: string[]) {
      let result: {result?: undefined, state: "continue"} | {result: Container, state: "end"} | undefined;
      const results = [];
      for (const line of lines) {
        result = this.parse_line(line);
        if (result.state === 'end') {
          results.push(result.result);
        }
      }
      if (!result) throw "must provide at least one lines";
      return {
        results: results,
        state: result.state
      };
    }

    // parse line
    // @param line [String] transaction line separated by \r\n
    // @return [Hash] {results: result (if state is end), state: parser state}
    parse_line(line: string): {result?: undefined, state: "continue"} | {result: Container, state: "end"} {
      if (this.section.is('idle')) {
        this.begin_parse();
      }
      this.parse_main(line);
      if (this.section.is('end')) {
        this.end_parse();
        return {
          result: this.get_result(),
          state: 'end'
        };
      } else {
        return {
          state: 'continue'
        };
      }
    }

    // parser main routine
    // @abstract implemented by subclasses
    abstract parse_main(line: string): void;
  }

  /** parser section state manager */
  export class Section {
    readonly sections: string[];
    private index = 0;

    constructor(sections: string[]) {
      this.sections = sections;
    }

    is(section: string) {
      return this.sections[this.index] === section;
    }

    next() {
      if (this.index === this.sections.length - 1) {
        return this.index = 0;
      } else {
        return this.index++;
      }
    }

    previous() {
      if (this.index === 0) {
        return this.index = this.sections.length - 1;
      } else {
        return this.index--;
      }
    }

    set(section: string) {
      return this.index = this.sections.indexOf(section);
    }

    get() {
      return this.sections[this.index];
    }
  }

  export namespace Header {
    export abstract class Parser<Container extends Headers> extends Shiori.Parser<Container> {
      parse_main(line: string) {
        const result = this.parse_header(line);
        if (result.state === 'end') {
          this.section.next();
        }
      }

      parse_header(line: string) {
        if (line.length) {
          const result = line.match(/^(.+?): (.*)$/);
          if (result) {
            this.result.header[result[1]] = result[2];
          } else {
            throw 'Invalid header line : ' + line;
          }
          return {
            state: 'continue'
          };
        } else {
          return {
            state: 'end'
          };
        }
      }
    }

    export class Section extends Shiori.Section {
      constructor(sections = ['idle', 'header', 'end']) {
        super(sections);
      }
    }
  }

  export namespace Request {
    // SHIORI Request parser
    export  class Parser extends Shiori.Parser<Message.Request> {
      parsers = {
        request_line: new Shiori.Request.RequestLine.Parser(),
        headers: new Shiori.Request.Header.Parser()
      };

      section = new Shiori.Request.Section();

      result_builder() {
        return new Message.Request({
          no_prepare: true
        });
      }

      parse_main(line: string) {
        const section = this.section.get() as "request_line" | "headers";
        const parser = this.parsers[section];
        const parser_result = parser.parse_line(line);
        if (parser_result.state === 'end') {
          this.result[section] = parser_result.result;
          this.section.next();
        }
      }
    }

    export namespace RequestLine {
      export class Parser {
        result: RequestLine;

        result_builder() {
          return new RequestLineClass();
        }

        parse(transaction: string) {
          return this.parse_chunk(transaction);
        }

        parse_chunk(chunk: string) {
          return this.parse_line(chunk);
        }

        parse_line(line: string): {result: RequestLine, state: "end"} {
          const result = line.match(/^([A-Za-z0-9 ]+) SHIORI\/([0-9.]+)/);
          if (!result) {
            throw 'Invalid request line : ' + line;
          }
          this.result = this.result_builder();
          this.result.method = result[1] as Method;
          this.result.protocol = 'SHIORI';
          this.result.version = result[2] as Version;
          return {
            result: this.result,
            state: 'end'
          };
        }

        abort_parse() {}
      }
    }

    export namespace Header {
      export class Parser extends Shiori.Header.Parser<Headers.Request> {
        constructor() {
          super();
          this.section = new Shiori.Request.Header.Section();
        }

        result_builder() {
          return new Headers.Request();
        }
      }

      export class Section extends Shiori.Header.Section {}
    }

    export class Section extends Shiori.Section {
      constructor(sections = ['idle', 'request_line', 'headers', 'end']) {
        super(sections);
      }
    }
  }

  export namespace Response {
    // SHIORI Response parser
    export class Parser extends Shiori.Parser<Message.Response> {
      parsers = {
        status_line: new Shiori.Response.StatusLine.Parser(),
        headers: new Shiori.Response.Header.Parser()
      };

      section = new Shiori.Response.Section();

      result_builder() {
        return new Message.Response({
          no_prepare: true
        });
      }

      parse_main(line: string) {
        const section = this.section.get() as "status_line" | "headers";
        const parser = this.parsers[section];
        const parser_result = parser.parse_line(line);
        if (parser_result.state === 'end') {
          this.result[section] = parser_result.result;
          this.section.next();
        }
      }
    }

    export namespace StatusLine {
      export class Parser {
        result: StatusLine;

        result_builder() {
          return new StatusLineClass();
        }

        parse(transaction: string) {
          return this.parse_chunk(transaction);
        }

        parse_chunk(chunk: string) {
          return this.parse_line(chunk);
        }

        parse_line(line: string): {result: StatusLine, state: "end"} {
          const result = line.match(/^SHIORI\/([0-9.]+) (\d+) (.+)$/);
          if (!result) {
            throw 'Invalid status line : ' + line;
          }
          this.result = this.result_builder();
          this.result.protocol = 'SHIORI';
          this.result.version = result[1] as Version;
          this.result.code = Number(result[2]);
          return {
            result: this.result,
            state: 'end'
          };
        }

        abort_parse() {}
      }
    }

    export namespace Header {
      export class Parser extends Shiori.Header.Parser<Headers.Response> {
        constructor() {
          super();
          this.section = new Shiori.Response.Header.Section();
        }

        result_builder() {
          return new Headers.Response();
        }
      }

      export class Section extends Shiori.Header.Section {}
    }

    export class Section extends Shiori.Section {
      constructor(sections = ['idle', 'status_line', 'headers', 'end']) {
        super(sections);
      }
    }
  }
}
