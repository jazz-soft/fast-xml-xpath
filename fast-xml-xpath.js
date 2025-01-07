const FXP = require('fast-xml-parser');
const XP = require('xx-path');

const opts = { preserveOrder: true, ignoreAttributes: false, allowBooleanAttributes: true, commentPropName: "#comment" };
const parser = new FXP.XMLParser(opts);
function Doc(x) {
  if (!(this instanceof Doc)) return new Doc(x);
  if (x instanceof Doc) return new Doc(x);
  if (typeof x == 'string') x = parser.parse(x);
  this.kind = 'document';
  this.orig = x;
  add(this, x);
}
function add(p, x) {
  var k, a, q, w;
  for (q of x) {
    for (k of Object.keys(q)) {
      if (k == '#text') {
        addChild(p, { kind: 'text', value: q[k], parent: p, orig: q });
        break;
      }
      else if (k == '#comment') {
        addChild(p, { kind: 'comment', value: q[k][0]['#text'], parent: p, orig: q });
        break;
      }
      else if (k != ':@') {
        if (k.startsWith('?')) {
          addChild(p, { kind: 'pi', name: k.substring(1), parent: p, orig: q });
        }
        else {
          w = { kind: 'element', name: k, parent: p, orig: q };
          if (q[':@']) for (a of Object.keys(q[':@'])) {
          console.log('arrt:', a);
            if (a == '@_xmlns') addNamespace(w, { kind: 'namespace', name: '', value: q[':@'][a], parent: w, orig: q[':@'][a] });
            if (a.startsWith('@_xmlns:')) addNamespace(w, { kind: 'namespace', name: a.substring(8), value: q[':@'][a], parent: w, orig: q[':@'][a] });
            else addAttr(w, { kind: 'attribute', name: a.substring(2), value: q[':@'][a], parent: w, orig: q[':@'][a] });
          }
          add(w, q[k]);
          addChild(p, w);
        }
      }
    }
  }
}
function addChild(p, x) {
  if (!p.children) p.children = [];
  p.children.push(x);
}
function addAttr(p, x) {
  if (!p.attributes) p.attributes = [];
  p.attributes.push(x);
}
function addNamespace(p, x) {
  if (!p.namespaces) p.namespaces = [];
  p.namespaces.push(x);
}

module.exports = {
  Doc: Doc,
  XPath: XP.XPath
};