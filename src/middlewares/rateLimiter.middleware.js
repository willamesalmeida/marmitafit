const ratelimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

//configure rate limiter
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //Maximum limit of 100 requests per IP in each 15 minute time window
  message:
    "Too many requests made from this IP, please try again after 15 minutes.",
});

// configure the slowing down request
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, //15minutes
  delayAfter: 50, // after 50 requests, its starts adding 500ms delay
  delayMs: 500, // define delay value
});

module.exports = {
  limiter,
  speedLimiter,
};
