const FXP = require('fast-xml-parser');
const XP = require('xx-path');

const opts = { preserveOrder: true, ignoreAttributes: false, allowBooleanAttributes: true, commentPropName: "#comment" };
const parser = new FXP.XMLParser(opts);
function Doc(x) {
  if (typeof x == 'string') x = parser.parse(x);
  var doc = { kind: 'document' };
  return doc;
}

module.exports = {
  Doc: Doc,
  XPath: XP.XPath
};