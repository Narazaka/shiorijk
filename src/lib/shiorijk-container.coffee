Function::property = (properties) ->
  for property, descriptions of properties
    Object.defineProperty @prototype, property, descriptions

ShioriJK.Message = {}

# SHIORI Request Message Container
class ShioriJK.Message.Request
  # initialize inner containers
  # @param request_line [Hash|ShioriJK.Requestline] request line
  # @param headers [Hash|ShioriJK.Headers.Request] request headers
  # @param no_prepare [Boolean] do not prepare default RequestLine and Headers by the constructor
  constructor : ({request_line, headers, no_prepare} = {}) ->
    @request_line =
      if request_line?
        if request_line instanceof ShioriJK.RequestLine
          request_line
        else
          new ShioriJK.RequestLine(request_line)
      else if not no_prepare
        new ShioriJK.RequestLine()
    @headers =
      if headers?
        if headers instanceof ShioriJK.Headers.Request
          headers
        else
          new ShioriJK.Headers.Request(headers)
      else
        new ShioriJK.Headers.Request()
  # @property [ShioriJK.RequestLine] RequestLine Container
  request_line: null
  # @property [ShioriJK.Headers.Request] Headers Container
  headers: null
  # Message to string
  # @return [String] message string
  toString : ->
    @request_line.toString() + '\r\n' + @headers.toString() + '\r\n'

# SHIORI Response Message Container
class ShioriJK.Message.Response
  # initialize inner containers
  # @param status_line [Hash|ShioriJK.Statusline] status line
  # @param headers [Hash|ShioriJK.Headers.Response] response headers
  # @param no_prepare [Boolean] do not prepare default StatusLine and Headers by the constructor
  constructor : ({status_line, headers, no_prepare} = {}) ->
    @status_line =
      if status_line?
        if status_line instanceof ShioriJK.StatusLine
          status_line
        else
          new ShioriJK.StatusLine(status_line)
      else if not no_prepare
        new ShioriJK.StatusLine()
    @headers =
      if headers?
        if headers instanceof ShioriJK.Headers.Response
          headers
        else
          new ShioriJK.Headers.Response(headers)
      else
        new ShioriJK.Headers.Response()
  # @property [ShioriJK.RequestLine] StatusLine Container
  status_line: null
  # @property [ShioriJK.Headers.Request] Headers Container
  headers: null
  # Message to string
  # @return [String] message string
  toString : ->
    @status_line.toString() + '\r\n' + @headers.toString() + '\r\n'

# SHIORI Request Message's RequestLine Container
class ShioriJK.RequestLine
  # initialize request line
  # @param method [string] method
  # @param protocol [string] protocol (default = 'SHIORI')
  # @param version [string] version
  constructor : ({method, protocol, version} = {}) ->
    @arguments = {}
    if method? then @method = method
    @protocol = protocol || 'SHIORI' # for codo
    if version? then @version = version
  # @property [String] request method
  method: null
  # @property [String] protocol
  protocol: null
  # @property [String] version
  version: null
  @property
    method :
      get : -> @arguments.method
      set : (method) ->
        if method? and @version?
          @validate_method_version method, @version
        else if method?
          switch method
            when 'GET', 'NOTIFY', 'GET Version', 'GET Sentence', 'GET Word', 'GET Status', 'TEACH', 'GET String', 'NOTIFY OwnerGhostName', 'NOTIFY OtherGhostName', 'TRANSLATE Sentence'
            else
              throw 'Invalid protocol method : ' + method
        @arguments.method = method
    protocol :
      get : -> @arguments.protocol
      set : (protocol) ->
        if protocol? and protocol != 'SHIORI'
          throw 'Invalid protocol : ' + protocol
        @arguments.protocol = protocol
    version :
      get : -> @arguments.version
      set : (version) ->
        if @method? and version?
          @validate_method_version @method, version
        else if version?
          switch version
            when '2.0', '2.2', '2.3', '2.4', '2.5', '2.6', '3.0'
            else
              throw 'Invalid protocol version : ' + version
        @arguments.version = version
  # validate
  # @param method [String] method name == 'SHIORI'
  # @param version [Number] version
  # @throw [String] if invalid
  validate_method_version : (method, version) ->
    is_valid = false
    switch version
      when '2.0'
        switch method
          when 'GET Version', 'NOTIFY OwnerGhostName', 'GET Sentence', 'GET Word', 'GET Status'
            is_valid = true
      when '2.2'
        switch method
          when 'GET Sentence'
            is_valid = true
      when '2.3'
        switch method
          when 'NOTIFY OtherGhostName', 'GET Sentence'
            is_valid = true
      when '2.4'
        switch method
          when 'TEACH'
            is_valid = true
      when '2.5'
        switch method
          when 'GET String'
            is_valid = true
      when '2.6' # spec is unknown
        switch method
          when 'GET Sentence', 'GET Status', 'GET String', 'NOTIFY OwnerGhostName', 'NOTIFY OtherGhostName', 'GET Version', 'TRANSLATE Sentence'
            is_valid = true
      when '3.0'
        switch method
          when 'GET', 'NOTIFY'
            is_valid = true
    unless is_valid
      throw 'Invalid protocol method and version : ' + method + ' SHIORI/' + version
  # Message to string
  # @return [String] message string
  toString : ->
    "#{@method} #{@protocol}/#{@version}"

# SHIORI Response Message's StatusLine Container
class ShioriJK.StatusLine
  # initialize status line
  # @param code [number] status code
  # @param protocol [string] protocol (default = 'SHIORI')
  # @param version [string] version
  constructor : ({code, protocol, version} = {}) ->
    @arguments = {}
    if code? then @code = code
    @protocol = protocol || 'SHIORI' # for codo
    if version? then @version = version
  # @property [String] status code
  code: null
  # @property [String] protocol
  protocol: null
  # @property [String] version
  version: null
  @property
    code :
      get : -> @arguments.code
      set : (code) ->
        if code? and not @message[code]?
          throw 'Invalid response code : ' + code
        @arguments.code = code
    protocol :
      get : -> @arguments.protocol
      set : (protocol) ->
        if protocol? and protocol != 'SHIORI'
          throw 'Invalid protocol : ' + protocol
        @arguments.protocol = protocol
    version :
      get : -> @arguments.version
      set : (version) ->
        if version?
          switch version
            when '2.0', '2.2', '2.3', '2.4', '2.5', '2.6', '3.0'
            else
              throw 'Invalid protocol version : ' + version
        @arguments.version = version
  # Message to string
  # @return [String] message string
  toString : ->
    "#{@protocol}/#{@version} #{@code} #{@message[@code]}"
  # @property [Hash<Number, String>] status messages for status codes
  message:
    200 : 'OK'
    204 : 'No Content'
    310 : 'Communicate'
    311 : 'Not Enough'
    312 : 'Advice'
    400 : 'Bad Request'
    418 : "I'm a tea pot"
    500 : 'Internal Server Error'

# SHIORI Message Headers Container
class ShioriJK.Headers
  # initialize headers
  # @param header [Hash<String, String>] headers
  constructor : (@header = {}) ->
  # @property [Hash<String, String>] headers
  header: null
  # get header
  # @param name [String] header name
  # @return [String] header value
  get : (name) ->
    if @header[name]?
      @header[name]
  # set header
  # @param name [String] header name
  # @param value [String] header value
  # @return [String] header value
  set : (name, value) ->
    @header[name] = value
  # get header separated by \x01 or some as an array
  # @param name [String] header name
  # @param separator [String] separator characters
  # @return [Array<String>] header values
  get_separated : (name, separator = '\x01') ->
    if @header[name]?
      @header[name].split separator
  # set header separated by \x01 or some as an array
  # @param name [String] header name
  # @param value [Array<String>] header values
  # @param separator [String] separator characters
  # @return [String] header value
  set_separated : (name, value, separator = '\x01') ->
    @header[name] = value.join separator
  # get header separated by \x02 and \x01 or some as an array
  # @param name [String] header name
  # @param separator1 [String] first level separator characters
  # @param separator2 [String] second level separator characters
  # @return [Array<Array<String>>] header values
  get_separated2 : (name, separator1 = '\x02', separator2 = '\x01') ->
    if @header[name]?
      ((element.split separator2) for element in @header[name].split separator1)
  # set header separated by \x02 and \x01 or some as an array
  # @param name [String] header name
  # @param value [Array<Array<String>>] header values
  # @param separator1 [String] first level separator characters
  # @param separator2 [String] second level separator characters
  # @return [String] header value
  set_separated2 : (name, value, separator1 = '\x02', separator2 = '\x01') ->
    @header[name] = (element.join separator2 for element in value).join separator1
  # get Reference* headers
  # @return [Array<String | undefined>] Reference* header values
  references : ->
    reference_max_index = -1
    for name of @header
      if (result = /^Reference(\d+)$/.exec(name)) and reference_max_index < result[1] - 0
        reference_max_index = result[1] - 0
    (@header["Reference#{index}"] for index in [0 ... reference_max_index + 1])
  # check that headers are line feed free
  # @throw [String] if not
  validate : ->
    for name, value of @header
      if "#{value}".match /\n/
        throw 'Invalid header value - line feed found : [' + name + '] : ' + value
  # Message to string
  # @return [String] message string
  toString : ->
    str = ''
    @validate()
    for name, value of @header
      str += "#{name}: #{value}\r\n"
    str
  # Reference* header (SHIORI/2.2-2.6,3.x)
  # @param index [Number] reference index
  # @return [String] header value
  Reference : (index) -> @get "Reference#{index}"
  # Value header (GET SHIORI/3.0)
  # Reference* header (SHIORI/2.2-2.6,3.x)
  # @param index [Number] reference index
  # @param separator [String] separator characters
  # @return [Array<String>] header values
  ReferenceSeparated : (index, separator = '\x01') -> (@get_separated "Reference#{index}", separator) || []
  # Reference* header (SHIORI/2.2-2.6,3.x)
  # @param index [Number] reference index
  # @param separator1 [String] first level separator characters
  # @param separator2 [String] second level separator characters
  # @return [Array<Array<String>>] header values
  ReferenceSeparated2 : (index, separator1 = '\x02', separator2 = '\x01') -> (@get_separated2 "Reference#{index}", separator1, separator2) || []

# SHIORI Request Message Headers Container
class ShioriJK.Headers.Request extends ShioriJK.Headers
  # @property [String] Charset header
  Charset: null
  # @property [String] Sender header
  Sender: null
  # @property [String] SecurityLevel header (SHIORI/2.2,2.6,3.x)
  SecurityLevel: null
  # @property [String] ID header (SHIORI/2.5,3.x)
  ID: null
  # @property [String] Event header (SHIORI/2.2)
  Event: null
  # @property [String] Type header (GET Word SHIORI/2.0)
  Type: null
  # @property [Array<String>] Status header (SHIORI/3.1)
  Status: null
  # @property [String] Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3)
  Ghost: null
  # @property [String] Sentence header (SHIORI/2.0,2.3b)
  Sentence: null
  # @property [String] To header (SHIORI/2.3b)
  To: null
  # @property [Number] Age header (SHIORI/2.3b)
  Age: null
  # @property [Array<Number>] Surface header (SHIORI/2.3b)
  Surface: null
  # @property [String] Word header (TEACH SHIORI/2.4)
  Word: null
  @property
    # @property [String] Charset header
    Charset :
      get : -> @get "Charset"
    # @property [String] Sender header
    Sender :
      get : -> @get "Sender"
    # @property [String] SecurityLevel header (SHIORI/2.2,2.6,3.x)
    SecurityLevel :
      get : -> @get "SecurityLevel"
    # @property [String] ID header (SHIORI/2.5,3.x)
    ID :
      get : -> @get "ID"
    # @property [String] Event header (SHIORI/2.2)
    Event :
      get : -> @get "Event"
    # @property [String] Type header (GET Word SHIORI/2.0)
    Type :
      get : -> @get "Type"
    # @property [Array<String>] Status header (SHIORI/3.1)
    Status :
      get : -> (@get_separated "Status", ",") || []
    # @property [String] Ghost header (NOTIFY OwnerGhostName SHIORI/2.0,2.3)
    Ghost :
      get : -> @get "Ghost"
    # @property [String] Sentence header (SHIORI/2.0,2.3b)
    Sentence :
      get : -> @get "Sentence"
    # @property [String] To header (SHIORI/2.3b)
    To :
      get : -> @get "To"
    # @property [Number] Age header (SHIORI/2.3b)
    Age :
      get : ->
        age = @get "Age"
        if age then Number(age)
    # @property [Array<Number>] Surface header (SHIORI/2.3b)
    Surface :
      get : -> Number(value) for value in (@get_separated "Surface", ",") || []
    # @property [String] Word header (TEACH SHIORI/2.4)
    Word :
      get : -> @get "Word"

# SHIORI Response Message Headers Container
class ShioriJK.Headers.Response extends ShioriJK.Headers
  # @property [Array<Array<Number>>] BalloonOffset header (SHIORI/2.0)
  BalloonOffset: null
  # @property [Array<Number>] Surface header (SHIORI/2.3b)
  Surface: null
  # @property [String] Sentence header (SHIORI/2.0,2.2,2.3b,2.4)
  Sentence: null
  # @property [String] Word header (GET Word SHIORI/2.0)
  Word: null
  # @property [Array<Number>] Status header (GET Status SHIORI/2.0)
  Status: null
  # @property [String] String header (GET String SHIORI/2.5)
  String: null
  # String header (GET String SHIORI/2.5)
  # @param separator [String] separator characters
  # @return [Array<String>] header values
  StringSeparated : (separator = '\x01') -> (@get_separated "String", separator) || []
  # String header (GET String SHIORI/2.5)
  # @param separator1 [String] first level separator characters
  # @param separator2 [String] second level separator characters
  # @return [Array<Array<String>>] header values
  StringSeparated2 : (separator1 = '\x02', separator2 = '\x01') -> (@get_separated2 "String", separator1, separator2) || []
  # @property [String] Value header (GET SHIORI/3.0)
  Value: null
  # Value header (GET SHIORI/3.0)
  # @param separator [String] separator characters
  # @return [Array<String>] header values
  ValueSeparated : (separator = '\x01') -> (@get_separated "Value", separator) || []
  # Value header (GET SHIORI/3.0)
  # @param separator1 [String] first level separator characters
  # @param separator2 [String] second level separator characters
  # @return [Array<Array<String>>] header values
  ValueSeparated2 : (separator1 = '\x02', separator2 = '\x01') -> (@get_separated2 "Value", separator1, separator2) || []
  @property
    BalloonOffset :
      get : ->
        for values in (@get_separated2 "BalloonOffset", ",") || []
          for value in values
            Number(value)
    Surface :
      get : -> Number(value) for value in (@get_separated "Surface", ",") || []
    Sentence :
      get : -> @get "Sentence"
    Word :
      get : -> @get "Word"
    Status :
      get : -> Number(value) for value in (@get_separated "Status", ",") || []
    String :
      get : -> @get "String"
    Value :
      get : -> @get "Value"
