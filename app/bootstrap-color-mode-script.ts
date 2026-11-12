/**
 * Inline head script (Bootstrap color modes) — sets data-bs-theme from prefers-color-scheme.
 * @see https://getbootstrap.com/docs/5.3/customize/color-modes/
 */
export const bootstrapColorModeHeadScript = `(function(){var root=document.documentElement;var query=window.matchMedia('(prefers-color-scheme: dark)');var apply=function(){root.setAttribute('data-bs-theme',query.matches?'dark':'light');};apply();query.addEventListener('change',apply);})();`;
