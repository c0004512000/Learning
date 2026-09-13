/* Lightweight shared syntax highlighter for lesson code blocks.
   It colors common JavaScript/TypeScript tokens without external dependencies. */
(() => {
  const KEYWORDS = new Set([
    'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for',
    'from', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
    'of', 'return', 'static', 'switch', 'throw', 'try', 'typeof', 'var',
    'while', 'yield', 'interface', 'type', 'implements', 'private', 'protected',
    'public', 'readonly'
  ]);

  const LITERALS = new Set(['true', 'false', 'null', 'undefined']);
  const OPERATOR_CHARS = new Set(['=', '+', '-', '*', '/', '%', '!', '<', '>', '&', '|', '?']);

  function appendToken(fragment, className, text) {
    if (!className) {
      fragment.appendChild(document.createTextNode(text));
      return;
    }
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    fragment.appendChild(span);
  }

  function isIdentifierStart(ch) {
    return !!ch && /[A-Za-z_$]/.test(ch);
  }

  function isIdentifierPart(ch) {
    return !!ch && /[A-Za-z0-9_$]/.test(ch);
  }

  function nextNonWhitespace(source, start) {
    let i = start;
    while (i < source.length && /\s/.test(source[i])) i += 1;
    return source[i] || '';
  }

  function highlight(codeEl) {
    if (codeEl.classList.contains('syntax-highlighted') || codeEl.hasAttribute('data-no-highlight')) return;

    const source = codeEl.textContent || '';
    const fragment = document.createDocumentFragment();
    let i = 0;

    while (i < source.length) {
      const ch = source[i];
      const next = source[i + 1];

      if (ch === '/' && next === '/') {
        let end = i + 2;
        while (end < source.length && source[end] !== '\n') end += 1;
        appendToken(fragment, 'syntax-comment', source.slice(i, end));
        i = end;
        continue;
      }

      if (ch === '/' && next === '*') {
        let end = i + 2;
        while (end < source.length && !(source[end] === '*' && source[end + 1] === '/')) end += 1;
        end = Math.min(source.length, end + 2);
        appendToken(fragment, 'syntax-comment', source.slice(i, end));
        i = end;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        const quote = ch;
        let end = i + 1;
        let escaped = false;
        while (end < source.length) {
          const current = source[end];
          if (!escaped && current === quote) {
            end += 1;
            break;
          }
          if (!escaped && current === '\\') {
            escaped = true;
          } else {
            escaped = false;
          }
          end += 1;
        }
        appendToken(fragment, 'syntax-string', source.slice(i, end));
        i = end;
        continue;
      }

      if (/\d/.test(ch)) {
        let end = i + 1;
        while (end < source.length && /[\d._]/.test(source[end])) end += 1;
        appendToken(fragment, 'syntax-number', source.slice(i, end));
        i = end;
        continue;
      }

      if (isIdentifierStart(ch)) {
        let end = i + 1;
        while (end < source.length && isIdentifierPart(source[end])) end += 1;
        const token = source.slice(i, end);
        const after = nextNonWhitespace(source, end);
        let className = '';

        if (KEYWORDS.has(token)) {
          className = 'syntax-keyword';
        } else if (LITERALS.has(token)) {
          className = 'syntax-literal';
        } else if (after === '(') {
          className = 'syntax-function';
        } else if (after === ':') {
          className = 'syntax-property';
        }

        appendToken(fragment, className, token);
        i = end;
        continue;
      }

      if (OPERATOR_CHARS.has(ch)) {
        let end = i + 1;
        while (end < source.length && OPERATOR_CHARS.has(source[end])) end += 1;
        appendToken(fragment, 'syntax-operator', source.slice(i, end));
        i = end;
        continue;
      }

      appendToken(fragment, '', ch);
      i += 1;
    }

    codeEl.replaceChildren(fragment);
    codeEl.classList.add('syntax-highlighted');
  }

  function run() {
    document.querySelectorAll('pre code').forEach(highlight);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
