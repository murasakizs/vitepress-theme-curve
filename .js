() => {
  const results = [];
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width < 150 || r.height < 150) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize) || 0;
    const before = getComputedStyle(el, '::before');
    const after = getComputedStyle(el, '::after');
    const hasPseudo = (before.content && before.content !== 'none' && before.content !== 'normal') ||
                      (after.content && after.content !== 'none' && after.content !== 'normal');
    const bigPseudo = hasPseudo && ((parseFloat(before.fontSize)||0) > 80 || (parseFloat(after.fontSize)||0) > 80);
    if (fs > 80 || bigPseudo) {
      results.push({
        tag: el.tagName,
        cls: String(el.className || '').slice(0, 100),
        id: el.id || '',
        w: Math.round(r.width), h: Math.round(r.height),
        top: Math.round(r.top), left: Math.round(r.left),
        fs,
        color: cs.color,
        opacity: cs.opacity,
        pos: cs.position,
        z: cs.zIndex,
        before: before.content + ' fs=' + before.fontSize + ' op=' + before.opacity,
        after: after.content + ' fs=' + after.fontSize + ' op=' + after.opacity,
        text: (el.textContent || '').trim().slice(0, 80)
      });
    }
  }
  // dump copyright pseudo specifically
  const c = document.querySelector('.copyright');
  let copyrightInfo = null;
  if (c) {
    const cr = c.getBoundingClientRect();
    const after = getComputedStyle(c, '::after');
    copyrightInfo = {
      rect: {top: Math.round(cr.top), left: Math.round(cr.left), w: Math.round(cr.width), h: Math.round(cr.height)},
      overflow: getComputedStyle(c).overflow,
      after: {content: after.content, fs: after.fontSize, op: after.opacity, top: after.top, right: after.right, pos: after.position, color: after.color, ff: after.fontFamily}
    };
  }
  return JSON.stringify({results, copyrightInfo, scrollY: window.scrollY}, null, 2);
}
