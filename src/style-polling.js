// Watches a style URL that's plausibly being actively edited locally (served
// from localhost, or any non-absolute path — i.e. not a stable published
// URL), re-fetching it on a timer so local file edits show up live without
// reselecting anything.
//
// This mirrors the original (legacy) MapStyleInput.svelte's approach:
// `isStillActive` is checked fresh at each tick via a plain function call —
// not a Svelte reactive dependency — so polling naturally stops the moment
// the caller's notion of "what's actually applied" moves on to something
// else. No separate stop handle or generation counter is needed for that;
// trying to do this as a $effect keyed on the map's url looks appealing but
// isn't equivalent — the effect re-runs on any mapsStore update for this
// map, including the ones a poll tick itself causes, which fights the
// timer rather than replacing it.
//
// The one behavior change from the original: a single failed tick logs and
// reschedules rather than silently ending the poll loop for good — see
// aws-style-editor's style_state.js for the fetch/poll approach this
// borrows that from.
const POLL_INTERVAL_MS = 3000;

const ABSOLUTE_URL_PATTERN = /^(?:[a-z+]+:)?\/\//i;

export const isLocalUrl = url => {
  if (!url) return false;
  return url.includes('localhost') || !ABSOLUTE_URL_PATTERN.test(url);
};

export const poll = (url, { isStillActive, fetchStyle, onChange, onError }) => {
  if (!isStillActive(url) || !isLocalUrl(url)) return;

  setTimeout(async () => {
    if (!isStillActive(url)) return;
    try {
      onChange(await fetchStyle(url));
    } catch (err) {
      onError?.(err);
    }
    poll(url, { isStillActive, fetchStyle, onChange, onError });
  }, POLL_INTERVAL_MS);
};
