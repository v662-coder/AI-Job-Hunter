/**
 * Pauses execution for the given milliseconds.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a random delay between min and max (inclusive), useful to
 * make automation look more human and avoid bot-detection patterns.
 */
function randomDelay(min = 1000, max = 3000) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return sleep(ms);
}

module.exports = { sleep, randomDelay };