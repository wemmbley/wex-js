/*!
 * jsx.js — Runtime JSX Transformer
 * Inspired by React 0.3 / JSXTransformer
 *
 * Usage:
 *   <script src="jsx.js"></script>
 *   <script type="text/jsx">
 *     const App = () => <div className="hello">World</div>;
 *   </script>
 *
 * JSX is compiled to: CreateJSON({ type, props: { ...attrs, children }, key, ref })
 * Override CreateJSON before loading jsx.js to plug in your own renderer.
 */
(function (global) {
  'use strict';

  // ─── Transformer ────────────────────────────────────────────────────────────

  function transform(src) {
    var i = 0;

    function cur()       { return src[i]; }
    function peek()      { return src[i + 1]; }
    function eat()       { return src[i++]; }
    function isLetter(c) { return c !== undefined && /[a-zA-Z_$]/.test(c); }
    function isIdChar(c) { return c !== undefined && /[a-zA-Z0-9_$.\-]/.test(c); }

    function skipWS() {
      while (i < src.length && /\s/.test(cur())) i++;
    }

    function eatName() {
      var s = '';
      while (i < src.length && isIdChar(cur())) s += eat();
      return s;
    }

    /* Consume string literal — opening quote already eaten. Returns full literal. */
    function eatStr(q) {
      var s = q;
      while (i < src.length && cur() !== q) {
        if (cur() === '\\') s += eat(); // escape
        s += eat();
      }
      return s + eat(); // closing quote
    }

    /* Consume balanced {…} — returns the inner JS expression string. */
    function eatBraces() {
      eat(); // opening {
      var depth = 1, s = '';
      while (i < src.length) {
        var c = cur();
        if      (c === '{')                           { depth++; s += eat(); }
        else if (c === '}')                           { eat(); if (--depth === 0) break; s += '}'; }
        else if (c === '"' || c === "'" || c === '`') { s += eatStr(eat()); }
        else if (c === '<' && isLetter(peek()))       { eat(); s += parseElement(); }
        else                                          { s += eat(); }
      }
      return s;
    }

    /* Parse a single prop value: "str", 'str', or {jsExpr}. */
    function parsePropValue() {
      var c = cur();
      if (c === '"' || c === "'") {
        eat();
        var s = '';
        while (i < src.length && cur() !== c) s += eat();
        eat();
        return JSON.stringify(s);
      }
      if (c === '{') return eatBraces();
      return 'true'; // bare boolean attribute
    }

    /* Parse all element props → [[name, jsValueCode], …] */
    function parseProps() {
      var props = [];
      while (i < src.length) {
        skipWS();
        if (cur() === '/' || cur() === '>') break;
        if (!isLetter(cur())) break;
        var name = eatName();
        skipWS();
        var val = 'true';
        if (cur() === '=') { eat(); val = parsePropValue(); }
        props.push([name, val]);
      }
      return props;
    }

    /* Parse children until </tagName> → array of JS expression strings. */
    function parseChildren() {
      var children = [];
      while (i < src.length) {

        /* closing tag — </tag> */
        if (cur() === '<' && peek() === '/') {
          eat(); eat();  // </
          eatName();     // tag name (discard)
          skipWS();
          eat();         // >
          break;
        }

        /* nested JSX element */
        if (cur() === '<' && isLetter(peek())) {
          eat(); // <
          children.push(parseElement());
          continue;
        }

        /* JS expression: {expr} */
        if (cur() === '{') {
          var expr = eatBraces().trim();
          if (expr) children.push('(' + expr + ')');
          continue;
        }

        /* text node */
        var text = '';
        while (i < src.length && cur() !== '<' && cur() !== '{') text += eat();
        var norm = text.replace(/[ \t]*\n[ \t]*/g, '\n').trim();
        if (norm) children.push(JSON.stringify(norm));
      }
      return children;
    }

    /* Parse one JSX element (< already consumed) → CreateJSON(…) string. */
    function parseElement() {
      skipWS();
      var tag   = eatName();
      var props = parseProps();
      skipWS();

      var self = (cur() === '/');
      if (self) eat();
      eat(); // >

      var children = self ? [] : parseChildren();

      /* lowercase → HTML string literal; Uppercase → component identifier */
      var typeCode = /^[A-Z]/.test(tag) ? tag : JSON.stringify(tag);

      var propParts = props.map(function (p) {
        return JSON.stringify(p[0]) + ': ' + p[1];
      });

      var childCode = children.length === 0 ? '[]'
          : children.length === 1 ? children[0]
              : '[' + children.join(', ') + ']';

      propParts.push('"children": ' + childCode);

      return (
          'CreateJSON({\n' +
          '  "type": ' + typeCode + ',\n' +
          '  "props": { ' + propParts.join(', ') + ' },\n' +
          '  "key": null,\n' +
          '  "ref": null\n' +
          '})'
      );
    }

    // ── Main scan ────────────────────────────────────────────────────────────
    var out = '';

    /* Characters that, when last in output, indicate we're in a JSX position. */
    var JSX_AFTER = /[=(,{[!&|?:;>]$/;

    function jsxContext() {
      var s = out.replace(/\s+$/, '');
      if (!s) return true;                    // start of file
      if (JSX_AFTER.test(s)) return true;    // =, (, {, [, !, &&, ||, ?, :, ;
      if (/\breturn$/.test(s)) return true;  // return <…>
      if (/[\n;]\s*$/.test(out)) return true; // new statement on next line
      return false;
    }

    while (i < src.length) {
      var c = cur();

      /* string literals — skip, don't scan for JSX inside them */
      if (c === '"' || c === "'" || c === '`') { out += eatStr(eat()); continue; }

      /* line comment */
      if (c === '/' && peek() === '/') {
        while (i < src.length && cur() !== '\n') out += eat();
        continue;
      }

      /* block comment */
      if (c === '/' && peek() === '*') {
        out += eat(); out += eat();
        while (i < src.length && !(cur() === '*' && peek() === '/')) out += eat();
        out += eat(); out += eat();
        continue;
      }

      /* JSX: < followed by a letter, in an eligible syntactic position */
      if (c === '<' && isLetter(peek()) && jsxContext()) {
        eat(); // <
        out += parseElement();
        continue;
      }

      out += eat();
    }

    return out;
  }

  // ─── Default CreateJSON ──────────────────────────────────────────────────────
  // Returns the descriptor as-is. Override BEFORE loading jsx.js.
  //
  // Example override to plug in your own vdom renderer:
  //   window.CreateJSON = function(node) { return MyRenderer.createElement(node); };

  if (!global.CreateJSON) {
    global.CreateJSON = function (node) { return node; };
  }

  // Expose transformer for debugging / build tools
  global.JSX = { transform: transform };

  // ─── Execute text/jsx script tags ───────────────────────────────────────────

  function runJSX() {
    var scripts = document.querySelectorAll('script[type="text/jsx"]');
    for (var s = 0; s < scripts.length; s++) {
      var raw = scripts[s].textContent;
      try {
        var js = transform(raw);
        /* Inject as a real <script> so const/let/var bind to the global scope,
           exactly as React 0.3's JSXTransformer did. */
        var el = document.createElement('script');
        el.textContent = js;
        document.head.appendChild(el);
      } catch (err) {
        console.error('[jsx.js] Error in script #' + s + ':', err.message);
        try { console.error('[jsx.js] Transformed output:\n', transform(raw)); } catch (_) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runJSX);
  } else {
    runJSX();
  }

}(window));
