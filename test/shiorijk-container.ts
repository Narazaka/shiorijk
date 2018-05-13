/// <reference types="mocha" />
// tslint:disable no-implicit-dependencies no-any no-non-null-assertion
import * as chai from "chai";
import * as ShioriJK from "../lib/shiorijk";

chai.should();

describe("request line", () => {
  let mrl: ShioriJK.RequestLine;
  beforeEach(() => {
    mrl = new ShioriJK.RequestLine();
  });
  it("should throw on wrong input", () => {
    (() => mrl.method = "GETTTTT" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    (() => mrl.protocol = "SAORI" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    (() => mrl.version = "2.9" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    (() => mrl.protocol = "SHIORI").should.not.throw(/Invalid/);
    (() => mrl.version = "3.0").should.not.throw(/Invalid/);
    (() => mrl.method = "GET Version").should.throw(/Invalid/);
    (() => mrl.method = "GET").should.not.throw(/Invalid/);
    (() => mrl.version = "2.9" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    mrl.method!.should.be.equal("GET");
    mrl.protocol!.should.be.equal("SHIORI");
    mrl.version!.should.be.equal("3.0");
  });
  it("should make request line string", () => {
    mrl.method = "GET Version";
    mrl.protocol = "SHIORI";
    mrl.version = "2.0";
    `${mrl}`.should.to.be.equal("GET Version SHIORI/2.0");
    mrl.method = undefined;
    mrl.version = "3.0";
    mrl.method = "GET";
    `${mrl}`.should.to.be.equal("GET SHIORI/3.0");
  });
  it("should be able to initialize with values", () => {
    mrl = new ShioriJK.RequestLine({
      method: "GET",
      protocol: "SHIORI",
      version: "3.0",
    });
    mrl.method!.should.be.equal("GET");
    mrl.protocol!.should.be.equal("SHIORI");
    mrl.version!.should.be.equal("3.0");
  });
  it("should be able to initialize with default values", () => {
    mrl = new ShioriJK.RequestLine({
      method: "GET",
      version: "3.0",
    });
    mrl.method!.should.be.equal("GET");
    mrl.protocol!.should.be.equal("SHIORI");
    mrl.version!.should.be.equal("3.0");
  });
  it("should throw on wrong initialize", () => {
    (() => new ShioriJK.RequestLine({method: "GETTT" as any})).should.throw(/Invalid/);
    (() => new ShioriJK.RequestLine({protocol: "SAORI" as any})).should.throw(/Invalid/);
    (() => new ShioriJK.RequestLine({version: "2.9" as any})).should.throw(/Invalid/);
    (() => new ShioriJK.RequestLine({method: "GET", version: "2.6"})).should.throw(/Invalid/);
  });
});

describe("status line", () => {
  let msl: ShioriJK.StatusLine;
  beforeEach(() => {
    msl = new ShioriJK.StatusLine();
  });
  it("should throw on wrong input", () => {
    (() => msl.code = 501).should.throw(/Invalid/);
    (() => msl.protocol = "SAORI" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    (() => msl.version = "2.9" as any).should.throw(/Invalid/); // tslint:disable-line no-unsafe-any
    (() => msl.code = 500).should.not.throw(/Invalid/);
    (() => msl.protocol = "SHIORI").should.not.throw(/Invalid/);
    (() => msl.version = "3.0").should.not.throw(/Invalid/);
    msl.code!.should.be.equal(500);
    msl.protocol!.should.be.equal("SHIORI");
    msl.version!.should.be.equal("3.0");
  });
  it("should make status line string", () => {
    msl.code = 500;
    msl.protocol = "SHIORI";
    msl.version = "2.0";
    `${msl}`.should.to.be.equal("SHIORI/2.0 500 Internal Server Error");
    msl.code = 200;
    msl.version = "3.0";
    `${msl}`.should.to.be.equal("SHIORI/3.0 200 OK");
  });
  it("should be able to initialize with values", () => {
    const mrl = new ShioriJK.StatusLine({
      code: 200,
      protocol: "SHIORI",
      version: "3.0",
    });
    mrl.code!.should.be.equal(200);
    mrl.protocol!.should.be.equal("SHIORI");
    mrl.version!.should.be.equal("3.0");
  });
  it("should be able to initialize with default values", () => {
    const mrl = new ShioriJK.StatusLine({
      code: 200,
      version: "3.0",
    });
    mrl.code!.should.be.equal(200);
    mrl.protocol!.should.be.equal("SHIORI");
    mrl.version!.should.be.equal("3.0");
  });
  it("should throw on wrong initialize", () => {
    (() => new ShioriJK.StatusLine({code: 501})).should.throw(/Invalid/);
    (() => new ShioriJK.StatusLine({protocol: "SAORI" as any})).should.throw(/Invalid/);
    (() => new ShioriJK.StatusLine({version: "2.9" as any})).should.throw(/Invalid/);
  });
});

describe("headers", () => {
  let mh: ShioriJK.Headers;
  beforeEach(() => {
    mh = new ShioriJK.Headers.Request();
  });
  it("should accessable", () => {
    mh.set("ID", "OnBoot");
    (mh.get("ID"))!.should.be.equal("OnBoot");
    mh.header.ID!.should.be.equal("OnBoot");
    mh.header.Reference6 = "halt";
    (mh.get("Reference6"))!.should.be.equal("halt");
    mh.header.Reference6.should.be.equal("halt");
  });
  it("should be deleted when set undefined", () => {
    mh.set("ID", "OnBoot");
    (mh.get("ID"))!.should.be.equal("OnBoot");
    mh.set("ID", undefined);
    (typeof mh.get("ID")).should.be.equal("undefined");
    ("ID" in mh.header).should.be.equal(false);
  });
  it("should handle \\x01", () => {
    mh.set("ID", "otherghostname");
    mh.set_separated("Reference0", ["Sakura", "0", "10"]);
    (mh.get_separated("Reference0"))!.should.to.deep.equal(["Sakura", "0", "10"]);
    (mh.get("Reference0"))!.should.be.equal("Sakura\x010\x0110");
  });
  it("should handle \\x02 and \\x01", () => {
    let sites;
    sites = [
      ["home", "http://narazaka.net/", "narazaka.net.png", "this is my home"],
      ["usada", "http://usada.sakura.vg/", "usada.png", "materia"],
    ];
    mh.set_separated2("Value", sites);
    (mh.get_separated2("Value"))!.should.to.deep.equal(sites);
    (mh.get_separated("Value", "\x02"))!.should.to.deep.equal([
      "home\x01http://narazaka.net/\x01narazaka.net.png\x01this is my home",
      "usada\x01http://usada.sakura.vg/\x01usada.png\x01materia",
    ]);
    (mh.get("Value"))!.should.be.equal(
      // tslint:disable-next-line max-line-length
      "home\x01http://narazaka.net/\x01narazaka.net.png\x01this is my home\x02usada\x01http://usada.sakura.vg/\x01usada.png\x01materia",
    );
  });
  it("should make headers string", () => {
    mh.header.ID = "OnBoot";
    mh.header.Reference0 = "master";
    mh.header.Reference6 = "halt";
    mh.header.Reference7 = "さくら";
    `${mh}`.should.to.be.equal(
      "ID: OnBoot\nReference0: master\nReference6: halt\nReference7: さくら\n".replace(/\r?\n/g, "\r\n"),
    );
  });
  it("should throw when toString() if header contains line feed", () => {
    mh.header.ID = "OnTest";
    mh.header.Reference0 = "foo\nbar";
    (() => `${mh}`).should.throw(/line feed/);
  });
  it("should be able to initialize with values", () => {
    mh = new ShioriJK.Headers({
      ID: "OnBoot",
      Reference6: "halt",
    });
    mh.header.ID!.should.be.equal("OnBoot");
    mh.header.Reference6!.should.be.equal("halt");
  });
  it("should get references array", () => {
    mh = new ShioriJK.Headers({
      ID: "OnBoot",
      Reference0: "master",
      Reference6: "",
      Reference7: "",
    });
    mh.references().should.be.deep.equal(["master", void 0, void 0, void 0, void 0, void 0, "", ""]);
  });
  it("reference header alias should work", () => {
    mh.header.Reference0 = "ref0";
    mh.Reference(0)!.should.be.equal("ref0");
  });
  it("reference separated header alias should work", () => {
    mh.ReferenceSeparated(0).should.be.deep.equal([]);
    mh.header.Reference0 = "0,1";
    mh.ReferenceSeparated(0, ",").should.be.deep.equal(["0", "1"]);
  });
  it("reference separated2 header alias should work", () => {
    mh.ReferenceSeparated2(0).should.be.deep.equal([]);
    mh.set_separated2("Reference0", [[0, 1], [2, 3]] as any);
    mh.ReferenceSeparated2(0).should.be.deep.equal([["0", "1"], ["2", "3"]]);
  });
});

describe("request headers", () => {
  let mh: ShioriJK.Headers.Request;
  beforeEach(() => {
    mh = new ShioriJK.Headers.Request();
  });
  it("header reader aliases should work", () => {
    mh.Status.should.be.deep.equal([]);
    mh.Surface.should.be.deep.equal([]);
    mh.header.Charset = "UTF-8";
    mh.header.Sender = "Ikagaka";
    mh.header.SecurityLevel = "local";
    mh.header.ID = "OnBoot";
    mh.header.Event = "OnBoot";
    mh.header.Type = "\\ms";
    mh.header.Status = "talking,online";
    mh.header.Ghost = "ikaga";
    mh.header.Sentence = "\\0\\e";
    mh.header.To = "ikaga";
    mh.header.Age = "0";
    mh.header.Surface = "0,10";
    mh.header.Word = "piyo";
    mh.Charset!.should.be.equal("UTF-8");
    mh.Sender!.should.be.equal("Ikagaka");
    mh.SecurityLevel!.should.be.equal("local");
    mh.ID!.should.be.equal("OnBoot");
    mh.Event!.should.be.equal("OnBoot");
    mh.Type!.should.be.equal("\\ms");
    mh.Status.should.be.deep.equal(["talking", "online"]);
    mh.Ghost!.should.be.equal("ikaga");
    mh.Sentence!.should.be.equal("\\0\\e");
    mh.To!.should.be.equal("ikaga");
    mh.Age!.should.be.equal(0);
    mh.Surface.should.be.deep.equal([0, 10]);
    mh.Word!.should.be.equal("piyo");
  });
  it("header writer aliases should work", () => {
    mh.Status.should.be.deep.equal([]);
    mh.Surface.should.be.deep.equal([]);
    mh.Charset = "UTF-8";
    mh.Sender = "Ikagaka";
    mh.SecurityLevel = "local";
    mh.ID = "OnBoot";
    mh.Event = "OnBoot";
    mh.Type = "\\ms";
    mh.Status = ["talking", "online"];
    mh.Ghost = "ikaga";
    mh.Sentence = "\\0\\e";
    mh.To = "ikaga";
    mh.Age = 0;
    mh.Surface = [0, 10];
    mh.Word = "piyo";
    mh.header.Charset!.should.be.equal("UTF-8");
    mh.header.Sender!.should.be.equal("Ikagaka");
    mh.header.SecurityLevel!.should.be.equal("local");
    mh.header.ID!.should.be.equal("OnBoot");
    mh.header.Event!.should.be.equal("OnBoot");
    mh.header.Type!.should.be.equal("\\ms");
    mh.header.Status!.should.be.deep.equal("talking,online");
    mh.header.Ghost!.should.be.equal("ikaga");
    mh.header.Sentence!.should.be.equal("\\0\\e");
    mh.header.To!.should.be.equal("ikaga");
    mh.header.Age!.should.be.equal("0");
    mh.header.Surface!.should.be.deep.equal("0,10");
    mh.header.Word!.should.be.equal("piyo");
  });
});

describe("response headers", () => {
  let mh: ShioriJK.Headers.Response;
  beforeEach(() => {
    mh = new ShioriJK.Headers.Response();
  });
  it("header reader aliases should work", () => {
    mh.BalloonOffset.should.be.deep.equal([]);
    mh.Surface.should.be.deep.equal([]);
    mh.Status.should.be.deep.equal([]);
    mh.header.BalloonOffset = "0,0\x0110,10";
    mh.header.Surface = "0,10";
    mh.header.Sentence = "\\0\\e";
    mh.header.Word = "piyo";
    mh.header.Status = "0,0,0,0,0,0";
    mh.BalloonOffset.should.be.deep.equal([[0, 0], [10, 10]]);
    mh.Surface.should.be.deep.equal([0, 10]);
    mh.Sentence!.should.be.equal("\\0\\e");
    mh.Word!.should.be.equal("piyo");
    mh.Status.should.be.deep.equal([0, 0, 0, 0, 0, 0]);
  });
  it("header writer aliases should work", () => {
    mh.BalloonOffset = [[0, 0], [10, 10]];
    mh.Surface = [0, 10];
    mh.Sentence = "\\0\\e";
    mh.Word = "piyo";
    mh.Status = [0, 0, 0, 0, 0, 0];
    mh.header.BalloonOffset!.should.be.equal("0,0\x0110,10");
    mh.header.Surface!.should.be.equal("0,10");
    mh.header.Sentence!.should.be.equal("\\0\\e");
    mh.header.Word!.should.be.equal("piyo");
    mh.header.Status!.should.be.equal("0,0,0,0,0,0");
  });
  it("String header alias should work", () => {
    mh.header.String = "ref0";
    mh.String!.should.be.equal("ref0");
  });
  it("String separated header alias should work", () => {
    mh.StringSeparated().should.be.deep.equal([]);
    mh.header.String = "0,1";
    mh.StringSeparated(",").should.be.deep.equal(["0", "1"]);
  });
  it("String separated2 header alias should work", () => {
    mh.StringSeparated2().should.be.deep.equal([]);
    mh.set_separated2("String", [[0, 1], [2, 3]] as any);
    mh.StringSeparated2().should.be.deep.equal([["0", "1"], ["2", "3"]]);
  });
  it("Value header alias should work", () => {
    mh.header.Value = "ref0";
    mh.Value!.should.be.equal("ref0");
  });
  it("Value separated header alias should work", () => {
    mh.ValueSeparated().should.be.deep.equal([]);
    mh.header.Value = "0,1";
    mh.ValueSeparated(",").should.be.deep.equal(["0", "1"]);
  });
  it("Value separated2 header alias should work", () => {
    mh.ValueSeparated2().should.be.deep.equal([]);
    mh.set_separated2("Value", [[0, 1], [2, 3]] as any);
    mh.ValueSeparated2().should.be.deep.equal([["0", "1"], ["2", "3"]]);
  });
});

describe("request message", () => {
  let m: ShioriJK.Message.Request;
  let mrl: ShioriJK.RequestLine;
  let mh: ShioriJK.Headers.Request;
  beforeEach(() => {
    m = new ShioriJK.Message.Request({
      no_prepare: true,
    });
    mrl = new ShioriJK.RequestLine();
    mh = new ShioriJK.Headers.Request();
    m.request_line = mrl;
    m.headers = mh;
  });
  it("should make message string", () => {
    mrl.method = "GET";
    mrl.protocol = "SHIORI";
    mrl.version = "3.0";
    mh.header.ID = "OnBoot";
    mh.header.Reference0 = "master";
    mh.header.Reference6 = "halt";
    mh.header.Reference7 = "さくら";
    `${m}`.should.to.be.equal(
      "GET SHIORI/3.0\nID: OnBoot\nReference0: master\nReference6: halt\nReference7: さくら\n\n".replace(/\r?\n/g, "\r\n"),
    );
  });
  it("should be able to initialize with hash values", () => {
    m = new ShioriJK.Message.Request({
      request_line: {
        method: "NOTIFY",
        version: "3.0",
      },
      headers: {
        ID: "OnBoot",
      },
    });
    m.request_line.method!.should.be.equal("NOTIFY");
    m.request_line.version!.should.be.equal("3.0");
    m.headers.header.ID!.should.be.equal("OnBoot");
  });
  it("should be able to initialize with class values", () => {
    mrl = new ShioriJK.RequestLine({
      method: "NOTIFY",
      version: "3.0",
    });
    mh = new ShioriJK.Headers.Request({
      ID: "OnBoot",
    });
    m = new ShioriJK.Message.Request({
      request_line: mrl,
      headers: mh,
    });
    m.request_line.method!.should.be.equal("NOTIFY");
    m.request_line.version!.should.be.equal("3.0");
    m.headers.header.ID!.should.be.equal("OnBoot");
  });
});

describe("response message", () => {
  let m: ShioriJK.Message.Response;
  let msl: ShioriJK.StatusLine;
  let mh: ShioriJK.Headers.Response;
  beforeEach(() => {
    m = new ShioriJK.Message.Response();
    msl = m.status_line;
    mh = m.headers;
    m.status_line = msl;
    m.headers = mh;
  });
  it("should make message string", () => {
    msl.code = 200;
    msl.protocol = "SHIORI";
    msl.version = "3.0";
    mh.header.Value = "\\h\\s2 うわ。404。 ファイルがないって。\\n \\n ‥‥見捨てられた？\\n \\n \\e";
    `${m}`.should.to.be.equal(
      "SHIORI/3.0 200 OK\nValue: \\h\\s2 うわ。404。 ファイルがないって。\\n \\n ‥‥見捨てられた？\\n \\n \\e\n\n".replace(/\r?\n/g, "\r\n"),
    );
  });
  it("should be able to initialize with hash values", () => {
    m = new ShioriJK.Message.Response({
      status_line: {
        code: 204,
        version: "3.0",
      },
      headers: {
        Value: "value",
      },
    });
    m.status_line.code!.should.be.equal(204);
    m.status_line.version!.should.be.equal("3.0");
    m.headers.header.Value!.should.be.equal("value");
  });
  it("should be able to initialize with class values", () => {
    msl = new ShioriJK.StatusLine({
      code: 204,
      version: "3.0",
    });
    mh = new ShioriJK.Headers.Response({
      Value: "value",
    });
    m = new ShioriJK.Message.Response({
      status_line: msl,
      headers: mh,
    });
    m.status_line.code!.should.be.equal(204);
    m.status_line.version!.should.be.equal("3.0");
    m.headers.header.Value!.should.be.equal("value");
  });
});
