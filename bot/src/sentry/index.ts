//const Sentry = require("@sentry/node");
// or use es6 import statements
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://9b4ecf91debc4f419d50c0fb4336838e@o347643.ingest.sentry.io/6024876",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

function transaction(name: string) {
    return Sentry.startTransaction({
        op: "test",
        name,
      });
}

export {
    Sentry as sentry,
    transaction
}