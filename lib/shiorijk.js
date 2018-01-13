/* (C) 2014-2016 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2016 */
var ShioriJK;

ShioriJK = {};

if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
  module.exports = ShioriJK;
}

Function.prototype.property = function(properties) {
  var descriptions, property, results1;
  results1 = [];
  for (property in properties) {
    descriptions = properties[property];
    results1.push(Object.defineProperty(this.prototype, property, descriptions));
  }
  return results1;
};

ShioriJK.Message = {};

ShioriJK.Message.Request = (function() {
  // SHIORI Request Message Container
  class Request {
    // initialize inner containers
    // @param request_line [Hash|ShioriJK.Requestline] request line
    // @param headers [Hash|ShioriJK.Headers.Request] request headers
    // @param no_prepare [Boolean] do not prepare default RequestLine and Headers by the constructor
    constructor({request_line, headers, no_prepare} = {}) {
      this.request_line = request_line != null ? request_line instanceof ShioriJK.RequestLine ? request_line : new ShioriJK.RequestLine(request_line) : !no_prepare ? new ShioriJK.RequestLine() : void 0;
      this.headers = headers != null ? headers instanceof ShioriJK.Headers.Request ? headers : new ShioriJK.Headers.Request(headers) : new ShioriJK.Headers.Request();
    }

    // Message to string
    // @return [String] message string
    toString() {
      return this.request_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
    }

  };

  // @property [ShioriJK.RequestLine] RequestLine Container
  Request.prototype.request_line = null;

  // @property [ShioriJK.Headers.Request] Headers Container
  Request.prototype.headers = null;

  return Request;

}).call(this);

ShioriJK.Message.Response = (function() {
  // SHIORI Response Message Container
  class Response {
    // initialize inner containers
    // @param status_line [Hash|ShioriJK.Statusline] status line
    // @param headers [Hash|ShioriJK.Headers.Response] response headers
    // @param no_prepare [Boolean] do not prepare default StatusLine and Headers by the constructor
    constructor({status_line, headers, no_prepare} = {}) {
      this.status_line = status_line != null ? status_line instanceof ShioriJK.StatusLine ? status_line : new ShioriJK.StatusLine(status_line) : !no_prepare ? new ShioriJK.StatusLine() : void 0;
      this.headers = headers != null ? headers instanceof ShioriJK.Headers.Response ? headers : new ShioriJK.Headers.Response(headers) : new ShioriJK.Headers.Response();
    }

    // Message to string
    // @return [String] message string
    toString() {
      return this.status_line.toString() + '\r\n' + this.headers.toString() + '\r\n';
    }

  };

  // @property [ShioriJK.RequestLine] StatusLine Container
  Response.prototype.status_line = null;

  // @property [ShioriJK.Headers.Request] Headers Container
  Response.prototype.headers = null;

  return Response;

}).call(this);

ShioriJK.RequestLine = (function() {
  // SHIORI Request Message's RequestLine Container
  class RequestLine {
    // initialize request line
    // @param method [string] method
    // @param protocol [string] protocol (default = 'SHIORI')
    // @param version [string] version
    constructor({method, protocol, version} = {}) {
      this.arguments = {};
      if (method != null) {
        this.method = method;
      }
      this.protocol = protocol || 'SHIORI'; // for codo
      if (version != null) {
        this.version = version;
      }
    }

    // validate
    // @param method [String] method name == 'SHIORI'
    // @param version [Number] version
    // @throw [String] if invalid
    validate_method_version(method, version) {
      var is_valid;
      is_valid = false;
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

    // Message to string
    // @return [String] message string
    toString() {
      return `${this.method} ${this.protocol}/${this.version}`;
    }

  };

  // @property [String] request method
  RequestLine.prototype.method = null;

  // @property [String] protocol
  RequestLine.prototype.protocol = null;

  // @property [String] version
  RequestLine.prototype.version = null;

  RequestLine.property({
    method: {
      get: function() {
        return this.arguments.method;
      },
      set: function(method) {
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
        return this.arguments.method = method;
      }
    },
    protocol: {
      get: function() {
        return this.arguments.protocol;
      },
      set: function(protocol) {
        if ((protocol != null) && protocol !== 'SHIORI') {
          throw 'Invalid protocol : ' + protocol;
        }
        return this.arguments.protocol = protocol;
      }
    },
    version: {
      get: function() {
        return this.arguments.version;
      },
      set: function(version) {
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
        return this.arguments.version = version;
      }
    }
  });

  return RequestLine;

}).call(this);

ShioriJK.StatusLine = (function() {
  // SHIORI Response Message's StatusLine Container
  class StatusLine {
    // initialize status line
    // @param code [number] status code
    // @param protocol [string] protocol (default = 'SHIORI')
    // @param version [string] version
    constructor({code, protocol, version} = {}) {
      this.arguments = {};
      if (code != null) {
        this.code = code;
      }
      this.protocol = protocol || 'SHIORI'; // for codo
      if (version != null) {
        this.version = version;
      }
    }

    // Message to string
    // @return [String] message string
    toString() {
      return `${this.protocol}/${this.version} ${this.code} ${this.message[this.code]}`;
    }

  };

  // @property [String] status code
  StatusLine.prototype.code = null;

  // @property [String] protocol
  StatusLine.prototype.protocol = null;

  // @property [String] version
  StatusLine.prototype.version = null;

  StatusLine.property({
    code: {
      get: function() {
        return this.arguments.code;
      },
      set: function(code) {
        if ((code != null) && (this.message[code] == null)) {
          throw 'Invalid response code : ' + code;
        }
        return this.arguments.code = code;
      }
    },
    protocol: {
      get: function() {
        return this.arguments.protocol;
      },
      set: function(protocol) {
        if ((protocol != null) && protocol !== 'SHIORI') {
          throw 'Invalid protocol : ' + protocol;
        }
        return this.arguments.protocol = protocol;
      }
    },
    version: {
      get: function() {
        return this.arguments.version;
      },
      set: function(version) {
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
        return this.arguments.version = version;
      }
    }
  });

  // @property [Hash<Number, String>] status messages for status codes
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

  return StatusLine;

}).call(this);

ShioriJK.Headers = (function() {
  // SHIORI Message Headers Container
  class Headers {
    // initialize headers
    // @param header [Hash<String, String>] headers
    constructor(header = {}) {
      this.header = header;
    }

    // get header
    // @param name [String] header name
    // @return [String] header value
    get(name) {
      if (this.header[name] != null) {
        return this.header[name];
      }
    }

    // set header
    // @param name [String] header name
    // @param value [String] header value
    // @return [String] header value
    set(name, value) {
      return this.header[name] = value;
    }

    // get header separated by \x01 or some as an array
    // @param name [String] header name
    // @param separator [String] separator characters
    // @return [Array<String>] header values
    get_separated(name, separator = '\x01') {
      if (this.header[name] != null) {
        return this.header[name].split(separator);
      }
    }

    // set header separated by \x01 or some as an array
    // @param name [String] header name
    // @param value [Array<String>] header values
    // @param separator [String] separator characters
    // @return [String] header value
    set_separated(name, value, separator = '\x01') {
      return this.header[name] = value.join(separator);
    }

    // get header separated by \x02 and \x01 or some as an array
    // @param name [String] header name
    // @param separator1 [String] first level separator characters
    // @param separator2 [String] second level separator characters
    // @return [Array<Array<String>>] header values
    get_separated2(name, separator1 = '\x02', separator2 = '\x01') {
      var element, i, len, ref, results1;
      if (this.header[name] != null) {
        ref = this.header[name].split(separator1);
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          element = ref[i];
          results1.push(element.split(separator2));
        }
        return results1;
      }
    }

    // set header separated by \x02 and \x01 or some as an array
    // @param name [String] header name
    // @param value [Array<Array<String>>] header values
    // @param separator1 [String] first level separator characters
    // @param separator2 [String] second level separator characters
    // @return [String] header value
    set_separated2(name, value, separator1 = '\x02', separator2 = '\x01') {
      var element;
      return this.header[name] = ((function() {
        var i, len, results1;
        results1 = [];
        for (i = 0, len = value.length; i < len; i++) {
          element = value[i];
          results1.push(element.join(separator2));
        }
        return results1;
      })()).join(separator1);
    }

    // get Reference* headers
    // @return [Array<String | undefined>] Reference* header values
    references() {
      var i, index, name, ref, reference_max_index, result, results1;
      reference_max_index = -1;
      for (name in this.header) {
        if ((result = /^Reference(\d+)$/.exec(name)) && reference_max_index < result[1] - 0) {
          reference_max_index = result[1] - 0;
        }
      }
      results1 = [];
      for (index = i = 0, ref = reference_max_index + 1; 0 <= ref ? i < ref : i > ref; index = 0 <= ref ? ++i : --i) {
        results1.push(this.header[`Reference${index}`]);
      }
      return results1;
    }

    // check that headers are line feed free
    // @throw [String] if not
    validate() {
      var name, ref, results1, value;
      ref = this.header;
      results1 = [];
      for (name in ref) {
        value = ref[name];
        if (`${value}`.match(/\n/)) {
          throw 'Invalid header value - line feed found : [' + name + '] : ' + value;
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    }

    // Message to string
    // @return [String] message string
    toString() {
      var name, ref, str, value;
      str = '';
      this.validate();
      ref = this.header;
      for (name in ref) {
        value = ref[name];
        str += `${name}: ${value}\r\n`;
      }
      return str;
    }

    // Reference* header (SHIORI/2.2-2.6,3.x)
    // @param index [Number] reference index
    // @return [String] header value
    Reference(index) {
      return this.get(`Reference${index}`);
    }

    // Value header (GET SHIORI/3.0)
    // Reference* header (SHIORI/2.2-2.6,3.x)
    // @param index [Number] reference index
    // @param separator [String] separator characters
    // @return [Array<String>] header values
    ReferenceSeparated(index, separator = '\x01') {
      return (this.get_separated(`Reference${index}`, separator)) || [];
    }

    // Reference* header (SHIORI/2.2-2.6,3.x)
    // @param index [Number] reference index
    // @param separator1 [String] first level separator characters
    // @param separator2 [String] second level separator characters
    // @return [Array<Array<String>>] header values
    ReferenceSeparated2(index, separator1 = '\x02', separator2 = '\x01') {
      return (this.get_separated2(`Reference${index}`, separator1, separator2)) || [];
    }

  };

  // @property [Hash<String, String>] headers
  Headers.prototype.header = null;

  return Headers;

}).call(this);

ShioriJK.Headers.Request = (function() {
  // SHIORI Request Message Headers Container
  class Request extends ShioriJK.Headers {};

  // @property [String] Charset header
  Request.prototype.Charset = null;

  // @property [String] Sender header
  Request.prototype.Sender = null;

  // @property [String] SecurityLevel header (SHIORI/2.2,2.6,3.x)
  Request.prototype.SecurityLevel = null;

  // @property [String] ID header (SHIORI/2.5,3.x)
  Request.prototype.ID = null;

  // @property [String] Event header (SHIORI/2.2)
  Request.prototype.Event = null;

  // @property [String] Type header (GET Word SHIORI/2.0)
  Request.prototype.Type = null;

  // @property [Array<String>] Status header (SHIORI/3.1)
  Request.prototype.Status = null;

  // @property [String] Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3)
  Request.prototype.Ghost = null;

  // @property [String] Sentence header (SHIORI/2.0,2.3b)
  Request.prototype.Sentence = null;

  // @property [String] To header (SHIORI/2.3b)
  Request.prototype.To = null;

  // @property [Number] Age header (SHIORI/2.3b)
  Request.prototype.Age = null;

  // @property [Array<Number>] Surface header (SHIORI/2.3b)
  Request.prototype.Surface = null;

  // @property [String] Word header (TEACH SHIORI/2.4)
  Request.prototype.Word = null;

  Request.property({
    // @property [String] Charset header
    Charset: {
      get: function() {
        return this.get("Charset");
      }
    },
    // @property [String] Sender header
    Sender: {
      get: function() {
        return this.get("Sender");
      }
    },
    // @property [String] SecurityLevel header (SHIORI/2.2,2.6,3.x)
    SecurityLevel: {
      get: function() {
        return this.get("SecurityLevel");
      }
    },
    // @property [String] ID header (SHIORI/2.5,3.x)
    ID: {
      get: function() {
        return this.get("ID");
      }
    },
    // @property [String] Event header (SHIORI/2.2)
    Event: {
      get: function() {
        return this.get("Event");
      }
    },
    // @property [String] Type header (GET Word SHIORI/2.0)
    Type: {
      get: function() {
        return this.get("Type");
      }
    },
    // @property [Array<String>] Status header (SHIORI/3.1)
    Status: {
      get: function() {
        return (this.get_separated("Status", ",")) || [];
      }
    },
    // @property [String] Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3)
    Ghost: {
      get: function() {
        return this.get("Ghost");
      }
    },
    // @property [String] Sentence header (SHIORI/2.0,2.3b)
    Sentence: {
      get: function() {
        return this.get("Sentence");
      }
    },
    // @property [String] To header (SHIORI/2.3b)
    To: {
      get: function() {
        return this.get("To");
      }
    },
    // @property [Number] Age header (SHIORI/2.3b)
    Age: {
      get: function() {
        var age;
        age = this.get("Age");
        if (age) {
          return Number(age);
        }
      }
    },
    // @property [Array<Number>] Surface header (SHIORI/2.3b)
    Surface: {
      get: function() {
        var i, len, ref, results1, value;
        ref = (this.get_separated("Surface", ",")) || [];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          value = ref[i];
          results1.push(Number(value));
        }
        return results1;
      }
    },
    // @property [String] Word header (TEACH SHIORI/2.4)
    Word: {
      get: function() {
        return this.get("Word");
      }
    }
  });

  return Request;

}).call(this);

ShioriJK.Headers.Response = (function() {
  // SHIORI Response Message Headers Container
  class Response extends ShioriJK.Headers {
    // String header (GET String SHIORI/2.5)
    // @param separator [String] separator characters
    // @return [Array<String>] header values
    StringSeparated(separator = '\x01') {
      return (this.get_separated("String", separator)) || [];
    }

    // String header (GET String SHIORI/2.5)
    // @param separator1 [String] first level separator characters
    // @param separator2 [String] second level separator characters
    // @return [Array<Array<String>>] header values
    StringSeparated2(separator1 = '\x02', separator2 = '\x01') {
      return (this.get_separated2("String", separator1, separator2)) || [];
    }

    // Value header (GET SHIORI/3.0)
    // @param separator [String] separator characters
    // @return [Array<String>] header values
    ValueSeparated(separator = '\x01') {
      return (this.get_separated("Value", separator)) || [];
    }

    // Value header (GET SHIORI/3.0)
    // @param separator1 [String] first level separator characters
    // @param separator2 [String] second level separator characters
    // @return [Array<Array<String>>] header values
    ValueSeparated2(separator1 = '\x02', separator2 = '\x01') {
      return (this.get_separated2("Value", separator1, separator2)) || [];
    }

  };

  // @property [Array<Array<Number>>] BalloonOffset header (SHIORI/2.0)
  Response.prototype.BalloonOffset = null;

  // @property [Array<Number>] Surface header (SHIORI/2.3b)
  Response.prototype.Surface = null;

  // @property [String] Sentence header (SHIORI/2.0,2.2,2.3b,2.4)
  Response.prototype.Sentence = null;

  // @property [String] Word header (GET Word SHIORI/2.0)
  Response.prototype.Word = null;

  // @property [Array<Number>] Status header (GET Status SHIORI/2.0)
  Response.prototype.Status = null;

  // @property [String] String header (GET String SHIORI/2.5)
  Response.prototype.String = null;

  // @property [String] Value header (GET SHIORI/3.0)
  Response.prototype.Value = null;

  Response.property({
    BalloonOffset: {
      get: function() {
        var i, len, ref, results1, value, values;
        ref = (this.get_separated2("BalloonOffset", ",")) || [];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          values = ref[i];
          results1.push((function() {
            var j, len1, results2;
            results2 = [];
            for (j = 0, len1 = values.length; j < len1; j++) {
              value = values[j];
              results2.push(Number(value));
            }
            return results2;
          })());
        }
        return results1;
      }
    },
    Surface: {
      get: function() {
        var i, len, ref, results1, value;
        ref = (this.get_separated("Surface", ",")) || [];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          value = ref[i];
          results1.push(Number(value));
        }
        return results1;
      }
    },
    Sentence: {
      get: function() {
        return this.get("Sentence");
      }
    },
    Word: {
      get: function() {
        return this.get("Word");
      }
    },
    Status: {
      get: function() {
        var i, len, ref, results1, value;
        ref = (this.get_separated("Status", ",")) || [];
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          value = ref[i];
          results1.push(Number(value));
        }
        return results1;
      }
    },
    String: {
      get: function() {
        return this.get("String");
      }
    },
    Value: {
      get: function() {
        return this.get("Value");
      }
    }
  });

  return Response;

}).call(this);

ShioriJK.Shiori = {};

ShioriJK.Shiori.Header = {};

ShioriJK.Shiori.Request = {};

ShioriJK.Shiori.Request.RequestLine = {};

ShioriJK.Shiori.Request.Header = {};

ShioriJK.Shiori.Response = {};

ShioriJK.Shiori.Response.StatusLine = {};

ShioriJK.Shiori.Response.Header = {};

// parser base class
ShioriJK.Shiori.Parser = class Parser {
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
  result_builder() {}

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
    var name, parser, ref;
    if (this.parsers != null) {
      ref = this.parsers;
      for (name in ref) {
        parser = ref[name];
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
  parse(transaction) {
    var result;
    this.begin_parse();
    result = this.parse_chunk(transaction);
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
  parse_chunk(chunk) {
    var lines;
    lines = chunk.split(/\r\n/);
    if (chunk.match(/\r\n$/)) {
      lines.pop();
    }
    return this.parse_lines(lines);
  }

  // parse chunk lines
  // @param lines [Array<String>] transaction chunk separated by \r\n
  // @return [Hash] {results: parse_line()'s result, state: parser state}
  parse_lines(lines) {
    var i, len, line, result, results;
    results = [];
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      result = this.parse_line(line);
      if (result.state === 'end') {
        results.push(result.result);
      }
    }
    return {
      results: results,
      state: result.state
    };
  }

  // parse line
  // @param line [String] transaction line separated by \r\n
  // @return [Hash] {results: result (if state is end), state: parser state}
  parse_line(line) {
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
  parse_main(line) {}

};

// parser section state manager
ShioriJK.Shiori.Section = class Section {
  constructor(sections1) {
    this.sections = sections1;
    this.index = 0;
  }

  is(section) {
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

  set(section) {
    return this.index = this.sections.indexOf(section);
  }

  get() {
    return this.sections[this.index];
  }

};

ShioriJK.Shiori.Header.Parser = class Parser extends ShioriJK.Shiori.Parser {
  parse_main(line) {
    var result;
    result = this.parse_header(line);
    if (result.state === 'end') {
      return this.section.next();
    }
  }

  parse_header(line) {
    var result;
    if (line.length) {
      if (result = line.match(/^(.+?): (.*)$/)) {
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

};

ShioriJK.Shiori.Header.Section = class Section extends ShioriJK.Shiori.Section {
  constructor(sections = ['idle', 'header', 'end']) {
    super(sections);
    this.index = 0;
  }

};

// SHIORI Request parser
ShioriJK.Shiori.Request.Parser = class Parser extends ShioriJK.Shiori.Parser {
  constructor() {
    super();
    this.parsers = {
      request_line: new ShioriJK.Shiori.Request.RequestLine.Parser(),
      headers: new ShioriJK.Shiori.Request.Header.Parser()
    };
    this.section = new ShioriJK.Shiori.Request.Section();
  }

  result_builder() {
    return new ShioriJK.Message.Request({
      no_prepare: true
    });
  }

  parse_main(line) {
    var parser, parser_result;
    parser = this.parsers[this.section.get()];
    parser_result = parser.parse_line(line);
    if (parser_result.state === 'end') {
      this.result[this.section.get()] = parser_result.result;
      return this.section.next();
    }
  }

};

ShioriJK.Shiori.Request.RequestLine.Parser = class Parser {
  constructor() {}

  result_builder() {
    return new ShioriJK.RequestLine();
  }

  parse(transaction) {
    return this.parse_chunk(transaction);
  }

  parse_chunk(chunk) {
    return this.parse_line(chunk);
  }

  parse_line(line) {
    var result;
    result = line.match(/^([A-Za-z0-9 ]+) SHIORI\/([0-9.]+)/);
    if (!result) {
      throw 'Invalid request line : ' + line;
    }
    this.result = this.result_builder();
    this.result.method = result[1];
    this.result.protocol = 'SHIORI';
    this.result.version = result[2];
    return {
      result: this.result,
      state: 'end'
    };
  }

};

ShioriJK.Shiori.Request.Header.Parser = class Parser extends ShioriJK.Shiori.Header.Parser {
  constructor() {
    super();
    this.section = new ShioriJK.Shiori.Request.Header.Section();
  }

  result_builder() {
    return new ShioriJK.Headers.Request();
  }

};

ShioriJK.Shiori.Request.Section = class Section extends ShioriJK.Shiori.Section {
  constructor(sections = ['idle', 'request_line', 'headers', 'end']) {
    super(sections);
    this.index = 0;
  }

};

ShioriJK.Shiori.Request.Header.Section = class Section extends ShioriJK.Shiori.Header.Section {};

// SHIORI Response parser
ShioriJK.Shiori.Response.Parser = class Parser extends ShioriJK.Shiori.Parser {
  constructor() {
    super();
    this.parsers = {
      status_line: new ShioriJK.Shiori.Response.StatusLine.Parser(),
      headers: new ShioriJK.Shiori.Response.Header.Parser()
    };
    this.section = new ShioriJK.Shiori.Response.Section();
  }

  result_builder() {
    return new ShioriJK.Message.Response({
      no_prepare: true
    });
  }

  parse_main(line) {
    var parser, parser_result;
    parser = this.parsers[this.section.get()];
    parser_result = parser.parse_line(line);
    if (parser_result.state === 'end') {
      this.result[this.section.get()] = parser_result.result;
      return this.section.next();
    }
  }

};

ShioriJK.Shiori.Response.StatusLine.Parser = class Parser {
  constructor() {}

  result_builder() {
    return new ShioriJK.StatusLine();
  }

  parse(transaction) {
    return this.parse_chunk(transaction);
  }

  parse_chunk(chunk) {
    return this.parse_line(chunk);
  }

  parse_line(line) {
    var result;
    result = line.match(/^SHIORI\/([0-9.]+) (\d+) (.+)$/);
    if (!result) {
      throw 'Invalid status line : ' + line;
    }
    this.result = this.result_builder();
    this.result.protocol = 'SHIORI';
    this.result.version = result[1];
    this.result.code = result[2] - 0;
    return {
      result: this.result,
      state: 'end'
    };
  }

};

ShioriJK.Shiori.Response.Header.Parser = class Parser extends ShioriJK.Shiori.Header.Parser {
  constructor() {
    super();
    this.section = new ShioriJK.Shiori.Response.Header.Section();
  }

  result_builder() {
    return new ShioriJK.Headers.Response();
  }

};

ShioriJK.Shiori.Response.Section = class Section extends ShioriJK.Shiori.Section {
  constructor(sections = ['idle', 'status_line', 'headers', 'end']) {
    super(sections);
    this.index = 0;
  }

};

ShioriJK.Shiori.Response.Header.Section = class Section extends ShioriJK.Shiori.Header.Section {};

//# sourceMappingURL=shiorijk.js.map
