/**
 * Third-party (ads, trackers, analytics) handling for demoqa.com.
 * Centralized here so the network blocking and the error filtering
 * always agree on what "third-party" means.
 */

/** Hosts that serve ads/trackers on demoqa.com. */
export const THIRD_PARTY_HOSTS =
  /(googlesyndication|doubleclick|adservice|googletagservices|googletagmanager|google-analytics|pagead|adsbygoogle|amazon-adsystem|criteo|taboola|outbrain)/i;

/** "Script error." is how browsers report errors thrown by cross-origin scripts. */
const CROSS_ORIGIN_SCRIPT_ERROR = /^Script error\.?$/i;

/**
 * Tells whether an uncaught exception came from a third-party script
 * rather than from the application under test.
 * @param {Error} error
 * @returns {boolean}
 */
export function isThirdPartyError(error) {
  const message = error?.message ?? '';
  const stack = error?.stack ?? '';

  return CROSS_ORIGIN_SCRIPT_ERROR.test(message.trim()) || THIRD_PARTY_HOSTS.test(stack);
}
