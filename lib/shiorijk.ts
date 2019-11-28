/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 *
 * (C) 2014-2018 Narazaka : Licensed under The [Zlib License](https://narazaka.net/license/Zlib?2014-2018)
 */

/** SHIORI/2.x/3.x method */
export type Method =
  "GET" |
  "NOTIFY" |
  "GET Version" |
  "GET Sentence" |
  "GET Word" |
  "GET Status" |
  "TEACH" |
  "GET String" |
  "NOTIFY OwnerGhostName" |
  "NOTIFY OtherGhostName" |
  "TRANSLATE Sentence";

/** SHIORI protocol */
export type Protocol = "SHIORI";

/** SHIORI version */
export type Version = "2.0" | "2.2" | "2.3" | "2.4" | "2.5" | "2.6" | "3.0";

/**
 * SHIORI Protocol Message Container
 */
export namespace Message {

  /** Message Containers' option */
  export interface Options {

    /** do not prepare default data by the constructor */
    no_prepare?: boolean;
  }

  /** SHIORI Request Message like data */
  export interface RequestLike {

    /** request line */
    request_line?: RequestLine | RequestLineLike;

    /** request headers */
    headers?: Headers.Request | {[name: string]: string};
  }

  /** SHIORI Request Message Container */
  export class Request implements RequestLike {
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
    constructor(data: RequestLike & Options = {}) {
      const {request_line, headers, no_prepare} = data;

      if (request_line == null) {
        if (!no_prepare) this.request_line = new RequestLine();
      } else if (request_line instanceof RequestLine) {
        this.request_line = request_line;
      } else {
        this.request_line = new RequestLine(request_line);
      }

      if (headers == null) {
        this.headers = new Headers.Request();
      } else if (headers instanceof Headers.Request) {
        this.headers = headers;
      } else {
        this.headers = new Headers.Request(headers);
      }
    }

    /**
     * Message to string
     * @return message string
     */
    toString() {
      return `${this.request_line}\r\n${this.headers}\r\n`;
    }
  }

  /** SHIORI Response Message like data */
  export interface ResponseLike {

    /** status line */
    status_line?: StatusLine | StatusLineLike;

    /** response headers */
    headers?: Headers.Response | {[name: string]: string};
  }

  /** SHIORI Response Message Container */
  export class Response implements ResponseLike {
    /** StatusLine Container */
    status_line: StatusLine;

    /** Headers Container */
    headers: Headers.Response;

    /**
     * initialize response
     * @param data response like data and options
     */
    constructor(data: ResponseLike & Options = {}) {
      const {status_line, headers, no_prepare} = data;

      if (status_line == null) {
        if (!no_prepare) this.status_line = new StatusLine();
      } else if (status_line instanceof StatusLine) {
        this.status_line = status_line;
      } else {
        this.status_line = new StatusLine(status_line);
      }

      if (headers == null) {
        this.headers = new Headers.Response();
      } else if (headers instanceof Headers.Response) {
        this.headers = headers;
      } else {
        this.headers = new Headers.Response(headers);
      }
    }

    /**
     * Message to string
     * @return message string
     */
    toString() {
      return `${this.status_line}\r\n${this.headers}\r\n`;
    }
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
export class RequestLine implements RequestLineLike {
  private readonly arguments: RequestLineLike = {};

  /**
   * initialize request line
   * @param data request line like data
   */
  constructor(data: RequestLineLike = {}) {
    const {method, protocol, version} = data;
    if (method != null) {
      this.method = method;
    }
    this.protocol = protocol || "SHIORI";
    if (version != null) {
      this.version = version;
    }
  }

  /** request method */
  get method(): Method | undefined {
    return this.arguments.method;
  }

  set method(method: Method | undefined) {
    if ((method != null) && (this.version != null)) {
      this.validate_method_version(method, this.version);
    } else if (method != null) {
      switch (method) {
        case "GET":
        case "NOTIFY":
        case "GET Version":
        case "GET Sentence":
        case "GET Word":
        case "GET Status":
        case "TEACH":
        case "GET String":
        case "NOTIFY OwnerGhostName":
        case "NOTIFY OtherGhostName":
        case "TRANSLATE Sentence":
          break;
        default:
          throw new RequestLine.InvalidValueError(`Invalid protocol method : ${method}`);
      }
    }
    this.arguments.method = method;
  }

  /** protocol */
  get protocol(): Protocol | undefined {
    return this.arguments.protocol;
  }

  set protocol(protocol: Protocol | undefined) {
    if ((protocol != null) && protocol !== "SHIORI") {
      throw new RequestLine.InvalidValueError(`Invalid protocol : ${protocol}`);
    }
    this.arguments.protocol = protocol;
  }

  /** version */
  get version(): Version | undefined {
    return this.arguments.version;
  }

  set version(version: Version | undefined) {
    if ((this.method != null) && (version != null)) {
      this.validate_method_version(this.method, version);
    } else if (version != null) {
      switch (version) {
        case "2.0":
        case "2.2":
        case "2.3":
        case "2.4":
        case "2.5":
        case "2.6":
        case "3.0":
          break;
        default:
          throw new RequestLine.InvalidValueError(`Invalid protocol version : ${version}`);
      }
    }
    this.arguments.version = version;
  }

  /**
   * validate
   * @param method method
   * @param version version
   * @throw if invalid
   */
  validate_method_version(method: Method, version: Version) { // eslint-disable-line class-methods-use-this, complexity
    let is_valid = false;
    switch (version) {
      case "2.0":
        switch (method) {
          case "GET Version":
          case "NOTIFY OwnerGhostName":
          case "GET Sentence":
          case "GET Word":
          case "GET Status":
            is_valid = true;
        }
        break;
      case "2.2":
        switch (method) {
          case "GET Sentence":
            is_valid = true;
        }
        break;
      case "2.3":
        switch (method) {
          case "NOTIFY OtherGhostName":
          case "GET Sentence":
            is_valid = true;
        }
        break;
      case "2.4":
        switch (method) {
          case "TEACH":
            is_valid = true;
        }
        break;
      case "2.5":
        switch (method) {
          case "GET String":
            is_valid = true;
        }
        break;
      case "2.6": // spec is unknown
        switch (method) {
          case "GET Sentence":
          case "GET Status":
          case "GET String":
          case "NOTIFY OwnerGhostName":
          case "NOTIFY OtherGhostName":
          case "GET Version":
          case "TRANSLATE Sentence":
            is_valid = true;
        }
        break;
      case "3.0":
        switch (method) {
          case "GET":
          case "NOTIFY":
            is_valid = true;
        }
    }
    if (!is_valid) {
      throw new RequestLine.InvalidValueError(`Invalid protocol method and version : ${method} SHIORI/${version}`);
    }
  }

  /**
   * Message to string
   * @return message string
   */
  toString() {
    return `${this.method} ${this.protocol}/${this.version}`;
  }
}

const RequestLineClass = RequestLine;

export namespace RequestLine { // eslint-disable-line no-redeclare

  /** Invalid value error */
  export class InvalidValueError extends Error {}
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
export class StatusLine implements StatusLineLike {
  /** status messages for status codes */
  message: {[code: number]: string};

  private readonly arguments: StatusLineLike = {};

  /**
   * initialize status line
   * @param data status line like data
   */
  constructor(data: StatusLineLike = {}) {
    const {code, protocol, version} = data;
    if (code != null) {
      this.code = code;
    }
    this.protocol = protocol || "SHIORI";
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
      throw new StatusLine.InvalidValueError(`Invalid response code : ${code}`);
    }
    this.arguments.code = code;
  }

  /** protocol */
  get protocol(): Protocol | undefined {
    return this.arguments.protocol;
  }

  set protocol(protocol: Protocol | undefined) {
    if ((protocol != null) && protocol !== "SHIORI") {
      throw new StatusLine.InvalidValueError(`Invalid protocol : ${protocol}`);
    }
    this.arguments.protocol = protocol;
  }

  /** version */
  get version(): Version | undefined {
    return this.arguments.version;
  }

  set version(version: Version | undefined) {
    if (version != null) {
      switch (version) {
        case "2.0":
        case "2.2":
        case "2.3":
        case "2.4":
        case "2.5":
        case "2.6":
        case "3.0":
          break;
        default:
          throw new StatusLine.InvalidValueError(`Invalid protocol version : ${version}`);
      }
    }
    this.arguments.version = version;
  }

  /**
   * Message to string
   * @return message string
   */
  toString() {
    return `${this.protocol}/${this.version} ${this.code} ${this.message[this.code as number]}`;
  }
}

StatusLine.prototype.message = {
  200: "OK",
  204: "No Content",
  310: "Communicate",
  311: "Not Enough",
  312: "Advice",
  400: "Bad Request",
  418: "I'm a tea pot",
  500: "Internal Server Error",
};

const StatusLineClass = StatusLine;

export namespace StatusLine { // eslint-disable-line no-redeclare

  /** Invalid value error */
  export class InvalidValueError extends Error {}
}

/** SHIORI Message Headers Container */
export class Headers {
  /** headers */
  header: {[name: string]: string | undefined};

  /**
   * initialize headers
   * @param header headers
   */
  constructor(header: {[name: string]: string} = {}) {
    this.header = header;
  }

  /**
   * get header
   * @param name header name
   * @return header value
   */
  get(name: string) {
    return this.header[name];
  }

  /**
   * set header
   *
   * header will be deleted if value == undefined
   * @param name header name
   * @param value header value
   * @return header value
   */
  set(name: string, value: string | undefined) {
    if (value === undefined) {
      delete this.header[name]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    } else {
      this.header[name] = value;
    }

    return value;
  }

  /**
   * get header separated by \x01 or some as an array
   * @param name header name
   * @param separator separator characters
   * @return header values
   */
  get_separated(name: string, separator = "\x01") {
    const value = this.header[name];
    if (value != null) { // eslint-disable-line no-negated-condition
      return value.split(separator);
    } else {
      return; // eslint-disable-line consistent-return
    }
  }

  /**
   * set header separated by \x01 or some as an array
   * @param name header name
   * @param value header values
   * @param separator separator characters
   * @return header value
   */
  set_separated(name: string, value: string[], separator = "\x01") {
    return (this.header[name] = value.join(separator));
  }

  /**
   * get header separated by \x02 and \x01 or some as an array
   * @param name header name
   * @param separator1 first level separator characters
   * @param separator2 second level separator characters
   * @return header values
   */
  get_separated2(name: string, separator1 = "\x02", separator2 = "\x01") {
    const value = this.header[name];
    if (value != null) { // eslint-disable-line no-negated-condition
      return value.split(separator1).map((value1) => value1.split(separator2));
    } else {
      return; // eslint-disable-line consistent-return
    }
  }

  /**
   * set header separated by \x02 and \x01 or some as an array
   * @param name header name
   * @param value header values
   * @param separator1 first level separator characters
   * @param separator2 second level separator characters
   * @return header value
   */
  set_separated2(name: string, value: string[][], separator1 = "\x02", separator2 = "\x01") {
    return (this.header[name] = value.map((value1) => value1.join(separator2)).join(separator1));
  }

  /**
   * get Reference* headers
   * @return Reference* header values
   */
  references() {
    let reference_max_index = -1;
    // forin for compatibility
    for (const name in this.header) { // eslint-disable-line guard-for-in
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
   * @throw if not
   */
  validate() {
    // forin for compatibility
    for (const name in this.header) { // eslint-disable-line guard-for-in
      const value = this.header[name];
      if (`${value}`.match(/\n/)) {
        throw new Headers.InvalidValueError(`Invalid header value - line feed found : [${name}] : ${value}`);
      }
    }
  }

  /**
   * Message to string
   * @return message string
   */
  toString() {
    this.validate();
    let str = "";
    // forin for compatibility
    for (const name in this.header) { // eslint-disable-line guard-for-in
      const value = this.header[name];
      str += `${name}: ${value}\r\n`;
    }

    return str;
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index reference index
   * @return header value
   */
  Reference(index: number) {
    return this.get(`Reference${index}`);
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index reference index
   * @param separator separator characters
   * @return header values
   */
  ReferenceSeparated(index: number, separator = "\x01") {
    return this.get_separated(`Reference${index}`, separator) || [];
  }

  /**
   * Reference* header (SHIORI/2.2-2.6,3.x)
   * @param index reference index
   * @param separator1 first level separator characters
   * @param separator2 second level separator characters
   * @return header values
   */
  ReferenceSeparated2(index: number, separator1 = "\x02", separator2 = "\x01") {
    return this.get_separated2(`Reference${index}`, separator1, separator2) || [];
  }
}

export namespace Headers { // eslint-disable-line no-redeclare

  /** Invalid value error */
  export class InvalidValueError extends Error {}

  /** SHIORI Request Message Headers Container */
  export class Request extends Headers {
    /** Charset header */
    get Charset() {
      return this.get("Charset");
    }

    set Charset(value) {
      this.set("Charset", value);
    }

    /** Sender header */
    get Sender() {
      return this.get("Sender");
    }

    set Sender(value) {
      this.set("Sender", value);
    }

    /** SecurityLevel header (SHIORI/2.2,2.6,3.x) */
    get SecurityLevel() {
      return this.get("SecurityLevel");
    }

    set SecurityLevel(value) {
      this.set("SecurityLevel", value);
    }

    /** ID header (SHIORI/2.5,3.x) */
    get ID() {
      return this.get("ID");
    }

    set ID(value) {
      this.set("ID", value);
    }

    /** Event header (SHIORI/2.2) */
    get Event() {
      return this.get("Event");
    }

    set Event(value) {
      this.set("Event", value);
    }

    /** Type header (GET Word SHIORI/2.0) */
    get Type() {
      return this.get("Type");
    }

    set Type(value) {
      this.set("Type", value);
    }

    /** Status header (SHIORI/3.1) */
    get Status() {
      return this.get_separated("Status", ",") || [];
    }

    set Status(value) {
      this.set_separated("Status", value, ",");
    }

    /** Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3) */
    get Ghost() {
      return this.get("Ghost");
    }

    set Ghost(value) {
      this.set("Ghost", value);
    }

    /** Sentence header (SHIORI/2.0,2.3b) */
    get Sentence() {
      return this.get("Sentence");
    }

    set Sentence(value) {
      this.set("Sentence", value);
    }

    /** To header (SHIORI/2.3b) */
    get To() {
      return this.get("To");
    }

    set To(value) {
      this.set("To", value);
    }

    /** Age header (SHIORI/2.3b) */
    get Age() {
      const age = this.get("Age");

      return age == null ? undefined : Number(age);
    }

    set Age(value) {
      this.set("Age", value == null ? undefined : value.toString());
    }

    /** Surface header (SHIORI/2.3b) */
    get Surface() {
      return (this.get_separated("Surface", ",") || []).map(Number);
    }

    set Surface(value) {
      this.set_separated("Surface", value.map((elem) => elem.toString()), ",");
    }

    /** Word header (TEACH SHIORI/2.4) */
    get Word() {
      return this.get("Word");
    }

    set Word(value) {
      this.set("Word", value);
    }
  }

  /** SHIORI Response Message Headers Container */
  export class Response extends Headers {
    /**
     * String header (GET String SHIORI/2.5)
     * @param separator separator characters
     * @return header values
     */
    StringSeparated(separator = "\x01") {
      return this.get_separated("String", separator) || [];
    }

    /**
     * set String header (GET String SHIORI/2.5)
     * @param value header values
     * @param separator separator characters
     * @return header value
     */
    setStringSeparated(value: string[], separator = "\x01") {
      return this.set_separated("String", value, separator);
    }

    /**
     * String header (GET String SHIORI/2.5)
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    StringSeparated2(separator1 = "\x02", separator2 = "\x01") {
      return this.get_separated2("String", separator1, separator2) || [];
    }

    /**
     * set String header (GET String SHIORI/2.5)
     * @param value header values
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header value
     */
    setStringSeparated2(value: string[][], separator1 = "\x02", separator2 = "\x01") {
      return this.set_separated2("String", value, separator1, separator2);
    }

    /**
     * Value header (GET SHIORI/3.0)
     * @param separator separator characters
     * @return header values
     */
    ValueSeparated(separator = "\x01") {
      return this.get_separated("Value", separator) || [];
    }

    /**
     * set Value header (GET SHIORI/3.0)
     * @param value header values
     * @param separator separator characters
     * @return header value
     */
    setValueSeparated(value: string[], separator = "\x01") {
      return this.set_separated("Value", value, separator);
    }

    /**
     * Value header (GET SHIORI/3.0)
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    ValueSeparated2(separator1 = "\x02", separator2 = "\x01") {
      return this.get_separated2("Value", separator1, separator2) || [];
    }

    /**
     * set Value header (GET SHIORI/3.0)
     * @param value header values
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    setValueSeparated2(value: string[][], separator1 = "\x02", separator2 = "\x01") {
      return this.set_separated2("Value", value, separator1, separator2);
    }

    /** BalloonOffset header (SHIORI/2.0) */
    get BalloonOffset() {
      return (this.get_separated2("BalloonOffset", "\x01", ",") || []).map((value1) => value1.map(Number));
    }

    set BalloonOffset(value) {
      this.set_separated2("BalloonOffset", value.map((elems) => elems.map((elem) => elem.toString())), "\x01", ",");
    }

    /** Surface header (SHIORI/2.3b) */
    get Surface() {
      return (this.get_separated("Surface", ",") || []).map(Number);
    }

    set Surface(value) {
      this.set_separated("Surface", value.map((elem) => elem.toString()), ",");
    }

    /** Sentence header (SHIORI/2.0,2.2,2.3b,2.4) */
    get Sentence() {
      return this.get("Sentence");
    }

    set Sentence(value) {
      this.set("Sentence", value);
    }

    /** Word header (GET Word SHIORI/2.0) */
    get Word() {
      return this.get("Word");
    }

    set Word(value) {
      this.set("Word", value);
    }

    /** Status header (GET Status SHIORI/2.0) */
    get Status() {
      return (this.get_separated("Status", ",") || []).map(Number);
    }

    set Status(value) {
      this.set_separated("Status", value.map((elem) => elem.toString()), ",");
    }

    /** String header (GET String SHIORI/2.5) */
    get String() {
      return this.get("String");
    }

    set String(value) {
      this.set("String", value);
    }

    /** Value header (GET SHIORI/3.0) */
    get Value() {
      return this.get("Value");
    }

    set Value(value) {
      this.set("Value", value);
    }
  }
}

export namespace Shiori {

  /** Parse error */
  export class ParseError extends Error {}

  /** parser base class */
  export abstract class Parser<Container> {
    section: Section<string>;
    result: Container;
    parsers: {[name: string]: {abort_parse?(): void}};

    is_parsing() {
      return !this.section.is("idle");
    }

    is_parsing_end() {
      return !this.section.is("end");
    }

    /**
     * get parser result
     * @return result
     */
    get_result() {
      return this.result;
    }

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
    begin_parse() {
      if (!this.section.is("idle")) {
        throw new ParseError("cannot begin parsing because previous transaction is still working");
      }
      this.result = this.result_builder();

      return this.section.next();
    }

    /**
     * set section state to begining section
     * @throw if before section != 'end'
     * @return section index
     */
    end_parse() {
      if (!this.section.is("end")) {
        this.abort_parse();
        throw new ParseError("parsing was aborted");
      }

      return this.section.next();
    }

    /**
     * set section state to begining section FORCE!
     *
     * @note recursively abort parsing
     * @return section index
     */
    abort_parse() {
      if (this.parsers != null) {
        // forin for compatibility
        for (const name in this.parsers) { // eslint-disable-line guard-for-in
          const parser = this.parsers[name];
          if (parser.abort_parse != null) {
            parser.abort_parse();
          }
        }
      }

      return this.section.set("idle");
    }

    /**
     * parse a transaction
     * @param transaction complete transaction
     * @return parse_chunk()'s one result
     * @throw if transaction is not complete
     */
    parse(transaction: string) {
      this.begin_parse();
      const result = this.parse_chunk(transaction);
      if (this.is_parsing()) {
        throw new ParseError("transaction is not closed");
      }
      if (result.results.length !== 1) {
        throw new ParseError("multiple transaction");
      }

      return result.results[0];
    }

    /**
     * parse transaction chunk
     * @param chunk transaction chunk
     * @return parse_lines()'s results
     */
    parse_chunk(chunk: string) {
      const lines = chunk.split(/\r\n/);
      if (chunk.match(/\r\n$/)) {
        lines.pop();
      }

      return this.parse_lines(lines);
    }

    /**
     * parse chunk lines
     * @param lines transaction chunk separated by \r\n
     * @return results: parse_line()'s result, state: parser state
     */
    parse_lines(lines: string[]) {
      let result: {result?: undefined; state: "continue"} | {result: Container; state: "end"} | undefined;
      const results = [];
      for (const line of lines) {
        result = this.parse_line(line);
        if (result.state === "end") {
          results.push(result.result);
        }
      }
      if (!result) throw new ParseError("must provide at least one lines");

      return {
        results,
        state: result.state,
      };
    }

    /**
     * parse line
     * @param line transaction line separated by \r\n
     * @return results: result (if state is end), state: parser state
     */
    parse_line(line: string): {result?: undefined; state: "continue"} | {result: Container; state: "end"} {
      if (this.section.is("idle")) {
        this.begin_parse();
      }
      this.parse_main(line);
      if (this.section.is("end")) {
        this.end_parse();

        return {
          result: this.get_result(),
          state:  "end",
        };
      } else {
        return {
          state: "continue",
        };
      }
    }

    /**
     * parser main routine
     */
    abstract parse_main(line: string): void;
  }

  /** parser section state manager */
  export class Section<S extends string> {
    readonly sections: readonly S[];
    private index = 0;

    constructor(sections: readonly S[]) {
      this.sections = sections;
    }

    is(section: S) {
      return this.sections[this.index] === section;
    }

    next() {
      if (this.index === this.sections.length - 1) {
        return (this.index = 0);
      } else {
        return this.index++;
      }
    }

    previous() {
      if (this.index === 0) {
        return (this.index = this.sections.length - 1);
      } else {
        return this.index--;
      }
    }

    set(section: S) {
      return (this.index = this.sections.indexOf(section));
    }

    get() {
      return this.sections[this.index];
    }
  }

  export namespace Header {
    // eslint-disable-next-line no-shadow
    export abstract class Parser<Container extends Headers> extends Shiori.Parser<Container> {
      parse_main(line: string) {
        const result = this.parse_header(line);
        if (result.state === "end") {
          this.section.next();
        }
      }

      parse_header(line: string) {
        if (line.length) {
          const result = line.match(/^(.+?): (.*)$/);
          if (result) {
            this.result.header[result[1]] = result[2];
          } else {
            throw new ParseError(`Invalid header line : ${line}`);
          }

          return {
            state: "continue",
          };
        } else {
          return {
            state: "end",
          };
        }
      }
    }

    // eslint-disable-next-line no-shadow
    export class Section extends Shiori.Section<"idle" | "header" | "end"> {
      constructor(sections = ["idle", "header", "end"] as const) {
        super(sections);
      }
    }
  }

  export namespace Request {

    /** SHIORI Request parser */
    // eslint-disable-next-line no-shadow
    export class Parser extends Shiori.Parser<Message.Request> {
      parsers = {
        request_line: new RequestLine.Parser(),
        headers:      new Header.Parser(),
      };

      section = new Section();

      result_builder() { // eslint-disable-line class-methods-use-this
        return new Message.Request({
          no_prepare: true,
        });
      }

      parse_main(line: string) {
        const section = this.section.get() as "request_line" | "headers";
        const parser = this.parsers[section];
        const parser_result = parser.parse_line(line);
        if (parser_result.state === "end") {
          this.result[section] = parser_result.result as Headers.Request & RequestLine;
          this.section.next();
        }
      }
    }

    // eslint-disable-next-line no-shadow
    export namespace RequestLine {
      // eslint-disable-next-line no-shadow
      export class Parser {
        result: RequestLine;

        result_builder() { // eslint-disable-line class-methods-use-this
          return new RequestLineClass();
        }

        parse(transaction: string) {
          return this.parse_chunk(transaction);
        }

        parse_chunk(chunk: string) {
          return this.parse_line(chunk);
        }

        parse_line(line: string): {result: RequestLine; state: "end"} {
          const result = line.match(/^([A-Za-z0-9 ]+) SHIORI\/([0-9.]+)/);
          if (!result) {
            throw new ParseError(`Invalid request line : ${line}`);
          }
          this.result = this.result_builder();
          this.result.method = result[1] as Method;
          this.result.protocol = "SHIORI";
          this.result.version = result[2] as Version;

          return {
            result: this.result,
            state:  "end",
          };
        }

        // eslint-disable-next-line class-methods-use-this, no-empty-function, @typescript-eslint/no-empty-function
        abort_parse() {}
      }
    }

    // eslint-disable-next-line no-shadow
    export namespace Header {
      // eslint-disable-next-line no-shadow
      export class Parser extends Shiori.Header.Parser<Headers.Request> {
        constructor() {
          super();
          this.section = new Section();
        }

        result_builder() { // eslint-disable-line class-methods-use-this
          return new Headers.Request();
        }
      }

      export class Section extends Shiori.Header.Section {}
    }

    // eslint-disable-next-line no-shadow
    export class Section extends Shiori.Section<"idle" | "request_line" | "headers" | "end"> {
      constructor(sections = ["idle", "request_line", "headers", "end"] as const) {
        super(sections);
      }
    }
  }

  export namespace Response {

    /** SHIORI Response parser */
    // eslint-disable-next-line no-shadow
    export class Parser extends Shiori.Parser<Message.Response> {
      parsers = {
        status_line: new StatusLine.Parser(),
        headers:     new Header.Parser(),
      };

      section = new Section();

      result_builder() { // eslint-disable-line class-methods-use-this
        return new Message.Response({
          no_prepare: true,
        });
      }

      parse_main(line: string) {
        const section = this.section.get() as "status_line" | "headers";
        const parser = this.parsers[section];
        const parser_result = parser.parse_line(line);
        if (parser_result.state === "end") {
          this.result[section] = parser_result.result as Headers.Response & StatusLine;
          this.section.next();
        }
      }
    }

    // eslint-disable-next-line no-shadow
    export namespace StatusLine {
      // eslint-disable-next-line no-shadow
      export class Parser {
        result: StatusLine;

        result_builder() { // eslint-disable-line class-methods-use-this
          return new StatusLineClass();
        }

        parse(transaction: string) {
          return this.parse_chunk(transaction);
        }

        parse_chunk(chunk: string) {
          return this.parse_line(chunk);
        }

        parse_line(line: string): {result: StatusLine; state: "end"} {
          const result = line.match(/^SHIORI\/([0-9.]+) (\d+) (.+)$/);
          if (!result) {
            throw new ParseError(`Invalid status line : ${line}`);
          }
          this.result = this.result_builder();
          this.result.protocol = "SHIORI";
          this.result.version = result[1] as Version;
          this.result.code = Number(result[2]);

          return {
            result: this.result,
            state:  "end",
          };
        }

        // eslint-disable-next-line class-methods-use-this, no-empty-function, @typescript-eslint/no-empty-function
        abort_parse() {}
      }
    }

    // eslint-disable-next-line no-shadow
    export namespace Header {
      // eslint-disable-next-line no-shadow
      export class Parser extends Shiori.Header.Parser<Headers.Response> {
        constructor() {
          super();
          this.section = new Section();
        }

        result_builder() { // eslint-disable-line class-methods-use-this
          return new Headers.Response();
        }
      }

      export class Section extends Shiori.Header.Section {}
    }

    // eslint-disable-next-line no-shadow
    export class Section extends Shiori.Section<"idle" | "status_line" | "headers" | "end"> {
      constructor(sections = ["idle", "status_line", "headers", "end"] as const) {
        super(sections);
      }
    }
  }
}
