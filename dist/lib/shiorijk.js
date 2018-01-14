(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ShioriJK"] = factory();
	else
		root["ShioriJK"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * SHIORI/2.x/3.x Protocol Parser/Builder/Container
 *
 * (C) 2014-2018 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2018
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SHIORI Protocol Message Container
 */
var Message;
(function (Message) {
    /** SHIORI Request Message Container */
    var Request = /** @class */ (function () {
        /**
         * initialize request
         * @param data request like data and options
         */
        function Request(data) {
            if (data === void 0) { data = {}; }
            var request_line = data.request_line, headers = data.headers, no_prepare = data.no_prepare;
            if (request_line == null) {
                if (!no_prepare)
                    this.request_line = new RequestLine();
            }
            else {
                if (request_line instanceof RequestLine) {
                    this.request_line = request_line;
                }
                else {
                    this.request_line = new RequestLine(request_line);
                }
            }
            if (headers == null) {
                this.headers = new Headers.Request();
            }
            else {
                if (headers instanceof Headers.Request) {
                    this.headers = headers;
                }
                else {
                    this.headers = new Headers.Request(headers);
                }
            }
        }
        /**
         * Message to string
         * @return message string
         */
        Request.prototype.toString = function () {
            return this.request_line + "\r\n" + this.headers + "\r\n";
        };
        return Request;
    }());
    Message.Request = Request;
    /** SHIORI Response Message Container */
    var Response = /** @class */ (function () {
        /**
         * initialize response
         * @param data response like data and options
         */
        function Response(data) {
            if (data === void 0) { data = {}; }
            var status_line = data.status_line, headers = data.headers, no_prepare = data.no_prepare;
            if (status_line == null) {
                if (!no_prepare)
                    this.status_line = new StatusLine();
            }
            else {
                if (status_line instanceof StatusLine) {
                    this.status_line = status_line;
                }
                else {
                    this.status_line = new StatusLine(status_line);
                }
            }
            if (headers == null) {
                this.headers = new Headers.Response();
            }
            else {
                if (headers instanceof Headers.Response) {
                    this.headers = headers;
                }
                else {
                    this.headers = new Headers.Response(headers);
                }
            }
        }
        /**
         * Message to string
         * @return message string
         */
        Response.prototype.toString = function () {
            return this.status_line + "\r\n" + this.headers + "\r\n";
        };
        return Response;
    }());
    Message.Response = Response;
})(Message = exports.Message || (exports.Message = {}));
/** SHIORI Request Message's RequestLine Container */
var RequestLine = /** @class */ (function () {
    /**
     * initialize request line
     * @param data request line like data
     */
    function RequestLine(data) {
        if (data === void 0) { data = {}; }
        this.arguments = {};
        var method = data.method, protocol = data.protocol, version = data.version;
        if (method != null) {
            this.method = method;
        }
        this.protocol = protocol || "SHIORI";
        if (version != null) {
            this.version = version;
        }
    }
    Object.defineProperty(RequestLine.prototype, "method", {
        /** request method */
        get: function () {
            return this.arguments.method;
        },
        set: function (method) {
            if ((method != null) && (this.version != null)) {
                this.validate_method_version(method, this.version);
            }
            else if (method != null) {
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
                        throw "Invalid protocol method : " + method;
                }
            }
            this.arguments.method = method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestLine.prototype, "protocol", {
        /** protocol */
        get: function () {
            return this.arguments.protocol;
        },
        set: function (protocol) {
            if ((protocol != null) && protocol !== "SHIORI") {
                throw "Invalid protocol : " + protocol;
            }
            this.arguments.protocol = protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestLine.prototype, "version", {
        /** version */
        get: function () {
            return this.arguments.version;
        },
        set: function (version) {
            if ((this.method != null) && (version != null)) {
                this.validate_method_version(this.method, version);
            }
            else if (version != null) {
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
                        throw "Invalid protocol version : " + version;
                }
            }
            this.arguments.version = version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * validate
     * @param method method
     * @param version version
     * @throw if invalid
     */
    RequestLine.prototype.validate_method_version = function (method, version) {
        var is_valid = false;
        // tslint:disable switch-default
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
            case "2.6":// spec is unknown
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
        // tslint:enable switch-default
        if (!is_valid) {
            throw "Invalid protocol method and version : " + method + " SHIORI/" + version;
        }
    };
    /**
     * Message to string
     * @return message string
     */
    RequestLine.prototype.toString = function () {
        return this.method + " " + this.protocol + "/" + this.version;
    };
    return RequestLine;
}());
exports.RequestLine = RequestLine;
var RequestLineClass = RequestLine; // tslint:disable-line variable-name
/** SHIORI Response Message's StatusLine Container */
var StatusLine = /** @class */ (function () {
    /**
     * initialize status line
     * @param data status line like data
     */
    function StatusLine(data) {
        if (data === void 0) { data = {}; }
        this.arguments = {};
        var code = data.code, protocol = data.protocol, version = data.version;
        if (code != null) {
            this.code = code;
        }
        this.protocol = protocol || "SHIORI";
        if (version != null) {
            this.version = version;
        }
    }
    Object.defineProperty(StatusLine.prototype, "code", {
        /** status code */
        get: function () {
            return this.arguments.code;
        },
        set: function (code) {
            if ((code != null) && (this.message[code] == null)) {
                throw "Invalid response code : " + code;
            }
            this.arguments.code = code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusLine.prototype, "protocol", {
        /** protocol */
        get: function () {
            return this.arguments.protocol;
        },
        set: function (protocol) {
            if ((protocol != null) && protocol !== "SHIORI") {
                throw "Invalid protocol : " + protocol;
            }
            this.arguments.protocol = protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusLine.prototype, "version", {
        /** version */
        get: function () {
            return this.arguments.version;
        },
        set: function (version) {
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
                        throw "Invalid protocol version : " + version;
                }
            }
            this.arguments.version = version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Message to string
     * @return message string
     */
    StatusLine.prototype.toString = function () {
        return this.protocol + "/" + this.version + " " + this.code + " " + this.message[this.code];
    };
    return StatusLine;
}());
exports.StatusLine = StatusLine;
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
var StatusLineClass = StatusLine; // tslint:disable-line variable-name
/** SHIORI Message Headers Container */
var Headers = /** @class */ (function () {
    /**
     * initialize headers
     * @param header headers
     */
    function Headers(header) {
        if (header === void 0) { header = {}; }
        this.header = header;
    }
    /**
     * get header
     * @param name header name
     * @return header value
     */
    Headers.prototype.get = function (name) {
        return this.header[name];
    };
    /**
     * set header
     * @param name header name
     * @param value header value
     * @return header value
     */
    Headers.prototype.set = function (name, value) {
        return this.header[name] = value;
    };
    /**
     * get header separated by \x01 or some as an array
     * @param name header name
     * @param separator separator characters
     * @return header values
     */
    Headers.prototype.get_separated = function (name, separator) {
        if (separator === void 0) { separator = "\x01"; }
        var value = this.header[name];
        if (value != null) {
            return value.split(separator);
        }
        else {
            return;
        }
    };
    /**
     * set header separated by \x01 or some as an array
     * @param name header name
     * @param value header values
     * @param separator separator characters
     * @return header value
     */
    Headers.prototype.set_separated = function (name, value, separator) {
        if (separator === void 0) { separator = "\x01"; }
        return this.header[name] = value.join(separator);
    };
    /**
     * get header separated by \x02 and \x01 or some as an array
     * @param name header name
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    Headers.prototype.get_separated2 = function (name, separator1, separator2) {
        if (separator1 === void 0) { separator1 = "\x02"; }
        if (separator2 === void 0) { separator2 = "\x01"; }
        var value = this.header[name];
        if (value != null) {
            return value.split(separator1).map(function (value1) { return value1.split(separator2); });
        }
        else {
            return;
        }
    };
    /**
     * set header separated by \x02 and \x01 or some as an array
     * @param name header name
     * @param value header values
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header value
     */
    Headers.prototype.set_separated2 = function (name, value, separator1, separator2) {
        if (separator1 === void 0) { separator1 = "\x02"; }
        if (separator2 === void 0) { separator2 = "\x01"; }
        return this.header[name] = value.map(function (value1) { return value1.join(separator2); }).join(separator1);
    };
    /**
     * get Reference* headers
     * @return Reference* header values
     */
    Headers.prototype.references = function () {
        var reference_max_index = -1;
        // forin for compatibility
        for (var name_1 in this.header) {
            var result = /^Reference(\d+)$/.exec(name_1);
            if (result && reference_max_index < Number(result[1])) {
                reference_max_index = Number(result[1]);
            }
        }
        var references = new Array(reference_max_index + 1);
        for (var index = 0; index <= reference_max_index; ++index) {
            references[index] = this.header["Reference" + index];
        }
        return references;
    };
    /**
     * check that headers are line feed free
     * @throw if not
     */
    Headers.prototype.validate = function () {
        // forin for compatibility
        for (var name_2 in this.header) {
            var value = this.header[name_2];
            if (("" + value).match(/\n/)) {
                throw "Invalid header value - line feed found : [" + name_2 + "] : " + value;
            }
        }
    };
    /**
     * Message to string
     * @return message string
     */
    Headers.prototype.toString = function () {
        this.validate();
        var str = "";
        // forin for compatibility
        for (var name_3 in this.header) {
            var value = this.header[name_3];
            str += name_3 + ": " + value + "\r\n";
        }
        return str;
    };
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @return header value
     */
    Headers.prototype.Reference = function (index) {
        return this.get("Reference" + index);
    };
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @param separator separator characters
     * @return header values
     */
    Headers.prototype.ReferenceSeparated = function (index, separator) {
        if (separator === void 0) { separator = "\x01"; }
        return this.get_separated("Reference" + index, separator) || [];
    };
    /**
     * Reference* header (SHIORI/2.2-2.6,3.x)
     * @param index reference index
     * @param separator1 first level separator characters
     * @param separator2 second level separator characters
     * @return header values
     */
    Headers.prototype.ReferenceSeparated2 = function (index, separator1, separator2) {
        if (separator1 === void 0) { separator1 = "\x02"; }
        if (separator2 === void 0) { separator2 = "\x01"; }
        return this.get_separated2("Reference" + index, separator1, separator2) || [];
    };
    return Headers;
}());
exports.Headers = Headers;
(function (Headers) {
    /** SHIORI Request Message Headers Container */
    var Request = /** @class */ (function (_super) {
        __extends(Request, _super);
        function Request() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Request.prototype, "Charset", {
            /** Charset header */
            get: function () {
                return this.get("Charset");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Sender", {
            /** Sender header */
            get: function () {
                return this.get("Sender");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "SecurityLevel", {
            /** SecurityLevel header (SHIORI/2.2,2.6,3.x) */
            get: function () {
                return this.get("SecurityLevel");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "ID", {
            /** ID header (SHIORI/2.5,3.x) */
            get: function () {
                return this.get("ID");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Event", {
            /** Event header (SHIORI/2.2) */
            get: function () {
                return this.get("Event");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Type", {
            /** Type header (GET Word SHIORI/2.0) */
            get: function () {
                return this.get("Type");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Status", {
            /** Status header (SHIORI/3.1) */
            get: function () {
                return (this.get_separated("Status", ",")) || [];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Ghost", {
            /** Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3) */
            get: function () {
                return this.get("Ghost");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Sentence", {
            /** Sentence header (SHIORI/2.0,2.3b) */
            get: function () {
                return this.get("Sentence");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "To", {
            /** To header (SHIORI/2.3b) */
            get: function () {
                return this.get("To");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Age", {
            /** Age header (SHIORI/2.3b) */
            get: function () {
                var age = this.get("Age");
                return age == null ? undefined : Number(age); // tslint:disable-line no-null-keyword
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Surface", {
            /** Surface header (SHIORI/2.3b) */
            get: function () {
                return (this.get_separated("Surface", ",") || []).map(Number);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Request.prototype, "Word", {
            /** Word header (TEACH SHIORI/2.4) */
            get: function () {
                return this.get("Word");
            },
            enumerable: true,
            configurable: true
        });
        return Request;
    }(Headers));
    Headers.Request = Request;
    /** SHIORI Response Message Headers Container */
    var Response = /** @class */ (function (_super) {
        __extends(Response, _super);
        function Response() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * String header (GET String SHIORI/2.5)
         * @param separator separator characters
         * @return header values
         */
        Response.prototype.StringSeparated = function (separator) {
            if (separator === void 0) { separator = "\x01"; }
            return this.get_separated("String", separator) || [];
        };
        /**
         * String header (GET String SHIORI/2.5)
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header values
         */
        Response.prototype.StringSeparated2 = function (separator1, separator2) {
            if (separator1 === void 0) { separator1 = "\x02"; }
            if (separator2 === void 0) { separator2 = "\x01"; }
            return this.get_separated2("String", separator1, separator2) || [];
        };
        /**
         * Value header (GET SHIORI/3.0)
         * @param separator separator characters
         * @return header values
         */
        Response.prototype.ValueSeparated = function (separator) {
            if (separator === void 0) { separator = "\x01"; }
            return this.get_separated("Value", separator) || [];
        };
        /**
         * Value header (GET SHIORI/3.0)
         * @param separator1 first level separator characters
         * @param separator2 second level separator characters
         * @return header values
         */
        Response.prototype.ValueSeparated2 = function (separator1, separator2) {
            if (separator1 === void 0) { separator1 = "\x02"; }
            if (separator2 === void 0) { separator2 = "\x01"; }
            return this.get_separated2("Value", separator1, separator2) || [];
        };
        Object.defineProperty(Response.prototype, "BalloonOffset", {
            /** BalloonOffset header (SHIORI/2.0) */
            get: function () {
                return (this.get_separated2("BalloonOffset", ",") || []).map(function (value1) { return value1.map(Number); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "Surface", {
            /** Surface header (SHIORI/2.3b) */
            get: function () {
                return (this.get_separated("Surface", ",") || []).map(Number);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "Sentence", {
            /** Sentence header (SHIORI/2.0,2.2,2.3b,2.4) */
            get: function () {
                return this.get("Sentence");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "Word", {
            /** Word header (GET Word SHIORI/2.0) */
            get: function () {
                return this.get("Word");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "Status", {
            /** Status header (GET Status SHIORI/2.0) */
            get: function () {
                return (this.get_separated("Status", ",") || []).map(Number);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "String", {
            /** String header (GET String SHIORI/2.5) */
            get: function () {
                return this.get("String");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Response.prototype, "Value", {
            /** Value header (GET SHIORI/3.0) */
            get: function () {
                return this.get("Value");
            },
            enumerable: true,
            configurable: true
        });
        return Response;
    }(Headers));
    Headers.Response = Response;
})(Headers = exports.Headers || (exports.Headers = {}));
exports.Headers = Headers;
var Shiori;
(function (Shiori) {
    /** parser base class */
    var Parser = /** @class */ (function () {
        function Parser() {
        }
        Parser.prototype.is_parsing = function () {
            return !this.section.is("idle");
        };
        Parser.prototype.is_parsing_end = function () {
            return !this.section.is("end");
        };
        /**
         * get parser result
         * @return result
         */
        Parser.prototype.get_result = function () {
            return this.result;
        };
        /**
         * set section state to first section
         * @throw if before section != 'idle'
         */
        Parser.prototype.begin_parse = function () {
            if (!this.section.is("idle")) {
                throw "cannot begin parsing because previous transaction is still working";
            }
            this.result = this.result_builder();
            return this.section.next();
        };
        /**
         * set section state to begining section
         * @throw if before section != 'end'
         */
        Parser.prototype.end_parse = function () {
            if (!this.section.is("end")) {
                this.abort_parse();
                throw "parsing was aborted";
            }
            return this.section.next();
        };
        /**
         * set section state to begining section FORCE!
         *
         * @note recursively abort parsing
         */
        Parser.prototype.abort_parse = function () {
            if (this.parsers != null) {
                // forin for compatibility
                for (var name_4 in this.parsers) {
                    var parser = this.parsers[name_4];
                    if (parser.abort_parse != null) {
                        parser.abort_parse();
                    }
                }
            }
            return this.section.set("idle");
        };
        /**
         * parse a transaction
         * @param transaction complete transaction
         * @return parse_chunk()'s one result
         * @throw if transaction is not complete
         */
        Parser.prototype.parse = function (transaction) {
            this.begin_parse();
            var result = this.parse_chunk(transaction);
            if (this.is_parsing()) {
                throw "transaction is not closed";
            }
            if (result.results.length !== 1) {
                throw "multiple transaction";
            }
            return result.results[0];
        };
        /**
         * parse transaction chunk
         * @param chunk transaction chunk
         * @return parse_lines()'s results
         */
        Parser.prototype.parse_chunk = function (chunk) {
            var lines = chunk.split(/\r\n/);
            if (chunk.match(/\r\n$/)) {
                lines.pop();
            }
            return this.parse_lines(lines);
        };
        /**
         * parse chunk lines
         * @param lines transaction chunk separated by \r\n
         * @return results: parse_line()'s result, state: parser state
         */
        Parser.prototype.parse_lines = function (lines) {
            var result;
            var results = [];
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                result = this.parse_line(line);
                if (result.state === "end") {
                    results.push(result.result);
                }
            }
            if (!result)
                throw "must provide at least one lines";
            return {
                results: results,
                state: result.state,
            };
        };
        /**
         * parse line
         * @param line transaction line separated by \r\n
         * @return results: result (if state is end), state: parser state
         */
        Parser.prototype.parse_line = function (line) {
            if (this.section.is("idle")) {
                this.begin_parse();
            }
            this.parse_main(line);
            if (this.section.is("end")) {
                this.end_parse();
                return {
                    result: this.get_result(),
                    state: "end",
                };
            }
            else {
                return {
                    state: "continue",
                };
            }
        };
        return Parser;
    }());
    Shiori.Parser = Parser;
    /** parser section state manager */
    var Section = /** @class */ (function () {
        function Section(sections) {
            this.index = 0;
            this.sections = sections;
        }
        Section.prototype.is = function (section) {
            return this.sections[this.index] === section;
        };
        Section.prototype.next = function () {
            if (this.index === this.sections.length - 1) {
                return this.index = 0;
            }
            else {
                return this.index++;
            }
        };
        Section.prototype.previous = function () {
            if (this.index === 0) {
                return this.index = this.sections.length - 1;
            }
            else {
                return this.index--;
            }
        };
        Section.prototype.set = function (section) {
            return this.index = this.sections.indexOf(section);
        };
        Section.prototype.get = function () {
            return this.sections[this.index];
        };
        return Section;
    }());
    Shiori.Section = Section;
    var Header;
    (function (Header) {
        // tslint:disable-next-line no-shadowed-variable
        var Parser = /** @class */ (function (_super) {
            __extends(Parser, _super);
            function Parser() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Parser.prototype.parse_main = function (line) {
                var result = this.parse_header(line);
                if (result.state === "end") {
                    this.section.next();
                }
            };
            Parser.prototype.parse_header = function (line) {
                if (line.length) {
                    var result = line.match(/^(.+?): (.*)$/);
                    if (result) {
                        this.result.header[result[1]] = result[2];
                    }
                    else {
                        throw "Invalid header line : " + line;
                    }
                    return {
                        state: "continue",
                    };
                }
                else {
                    return {
                        state: "end",
                    };
                }
            };
            return Parser;
        }(Shiori.Parser));
        Header.Parser = Parser;
        // tslint:disable-next-line no-shadowed-variable
        var Section = /** @class */ (function (_super) {
            __extends(Section, _super);
            function Section(sections) {
                if (sections === void 0) { sections = ["idle", "header", "end"]; }
                return _super.call(this, sections) || this;
            }
            return Section;
        }(Shiori.Section));
        Header.Section = Section;
    })(Header = Shiori.Header || (Shiori.Header = {}));
    var Request;
    (function (Request) {
        /** SHIORI Request parser */
        // tslint:disable-next-line no-shadowed-variable
        var Parser = /** @class */ (function (_super) {
            __extends(Parser, _super);
            function Parser() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.parsers = {
                    request_line: new RequestLine.Parser(),
                    headers: new Header.Parser(),
                };
                _this.section = new Section();
                return _this;
            }
            Parser.prototype.result_builder = function () {
                return new Message.Request({
                    no_prepare: true,
                });
            };
            Parser.prototype.parse_main = function (line) {
                var section = this.section.get();
                var parser = this.parsers[section];
                var parser_result = parser.parse_line(line);
                if (parser_result.state === "end") {
                    this.result[section] = parser_result.result;
                    this.section.next();
                }
            };
            return Parser;
        }(Shiori.Parser));
        Request.Parser = Parser;
        // tslint:disable-next-line no-shadowed-variable
        var RequestLine;
        (function (RequestLine) {
            // tslint:disable-next-line no-shadowed-variable
            var Parser = /** @class */ (function () {
                function Parser() {
                }
                Parser.prototype.result_builder = function () {
                    return new RequestLineClass();
                };
                Parser.prototype.parse = function (transaction) {
                    return this.parse_chunk(transaction);
                };
                Parser.prototype.parse_chunk = function (chunk) {
                    return this.parse_line(chunk);
                };
                Parser.prototype.parse_line = function (line) {
                    var result = line.match(/^([A-Za-z0-9 ]+) SHIORI\/([0-9.]+)/);
                    if (!result) {
                        throw "Invalid request line : " + line;
                    }
                    this.result = this.result_builder();
                    this.result.method = result[1];
                    this.result.protocol = "SHIORI";
                    this.result.version = result[2];
                    return {
                        result: this.result,
                        state: "end",
                    };
                };
                Parser.prototype.abort_parse = function () { }; // tslint:disable-line prefer-function-over-method no-empty
                return Parser;
            }());
            RequestLine.Parser = Parser;
        })(RequestLine = Request.RequestLine || (Request.RequestLine = {}));
        // tslint:disable-next-line no-shadowed-variable
        var Header;
        (function (Header) {
            // tslint:disable-next-line no-shadowed-variable
            var Parser = /** @class */ (function (_super) {
                __extends(Parser, _super);
                function Parser() {
                    var _this = _super.call(this) || this;
                    _this.section = new Section();
                    return _this;
                }
                Parser.prototype.result_builder = function () {
                    return new Headers.Request();
                };
                return Parser;
            }(Shiori.Header.Parser));
            Header.Parser = Parser;
            // tslint:disable-next-line no-shadowed-variable
            var Section = /** @class */ (function (_super) {
                __extends(Section, _super);
                function Section() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Section;
            }(Shiori.Header.Section));
            Header.Section = Section;
        })(Header = Request.Header || (Request.Header = {}));
        // tslint:disable-next-line no-shadowed-variable
        var Section = /** @class */ (function (_super) {
            __extends(Section, _super);
            function Section(sections) {
                if (sections === void 0) { sections = ["idle", "request_line", "headers", "end"]; }
                return _super.call(this, sections) || this;
            }
            return Section;
        }(Shiori.Section));
        Request.Section = Section;
    })(Request = Shiori.Request || (Shiori.Request = {}));
    var Response;
    (function (Response) {
        /** SHIORI Response parser */
        // tslint:disable-next-line no-shadowed-variable
        var Parser = /** @class */ (function (_super) {
            __extends(Parser, _super);
            function Parser() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.parsers = {
                    status_line: new StatusLine.Parser(),
                    headers: new Header.Parser(),
                };
                _this.section = new Section();
                return _this;
            }
            Parser.prototype.result_builder = function () {
                return new Message.Response({
                    no_prepare: true,
                });
            };
            Parser.prototype.parse_main = function (line) {
                var section = this.section.get();
                var parser = this.parsers[section];
                var parser_result = parser.parse_line(line);
                if (parser_result.state === "end") {
                    this.result[section] = parser_result.result;
                    this.section.next();
                }
            };
            return Parser;
        }(Shiori.Parser));
        Response.Parser = Parser;
        // tslint:disable-next-line no-shadowed-variable
        var StatusLine;
        (function (StatusLine) {
            // tslint:disable-next-line no-shadowed-variable
            var Parser = /** @class */ (function () {
                function Parser() {
                }
                Parser.prototype.result_builder = function () {
                    return new StatusLineClass();
                };
                Parser.prototype.parse = function (transaction) {
                    return this.parse_chunk(transaction);
                };
                Parser.prototype.parse_chunk = function (chunk) {
                    return this.parse_line(chunk);
                };
                Parser.prototype.parse_line = function (line) {
                    var result = line.match(/^SHIORI\/([0-9.]+) (\d+) (.+)$/);
                    if (!result) {
                        throw "Invalid status line : " + line;
                    }
                    this.result = this.result_builder();
                    this.result.protocol = "SHIORI";
                    this.result.version = result[1];
                    this.result.code = Number(result[2]);
                    return {
                        result: this.result,
                        state: "end",
                    };
                };
                Parser.prototype.abort_parse = function () { }; // tslint:disable-line prefer-function-over-method no-empty
                return Parser;
            }());
            StatusLine.Parser = Parser;
        })(StatusLine = Response.StatusLine || (Response.StatusLine = {}));
        // tslint:disable-next-line no-shadowed-variable
        var Header;
        (function (Header) {
            // tslint:disable-next-line no-shadowed-variable
            var Parser = /** @class */ (function (_super) {
                __extends(Parser, _super);
                function Parser() {
                    var _this = _super.call(this) || this;
                    _this.section = new Section();
                    return _this;
                }
                Parser.prototype.result_builder = function () {
                    return new Headers.Response();
                };
                return Parser;
            }(Shiori.Header.Parser));
            Header.Parser = Parser;
            // tslint:disable-next-line no-shadowed-variable
            var Section = /** @class */ (function (_super) {
                __extends(Section, _super);
                function Section() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Section;
            }(Shiori.Header.Section));
            Header.Section = Section;
        })(Header = Response.Header || (Response.Header = {}));
        // tslint:disable-next-line no-shadowed-variable
        var Section = /** @class */ (function (_super) {
            __extends(Section, _super);
            function Section(sections) {
                if (sections === void 0) { sections = ["idle", "status_line", "headers", "end"]; }
                return _super.call(this, sections) || this;
            }
            return Section;
        }(Shiori.Section));
        Response.Section = Section;
    })(Response = Shiori.Response || (Shiori.Response = {}));
})(Shiori = exports.Shiori || (exports.Shiori = {}));


/***/ })
/******/ ]);
});
//# sourceMappingURL=shiorijk.js.map