## Pubnub Mobx

[![CircleCI][circleci-badge]][circleci-href]
[![NPM][npm-version-badge]][npm-href]
[![BundlePhobia][bundlephobia-badge]][bundlephobia-href]

### Peer Dependencies

This library relies on having mobx and pubnub installed. If you haven't installed them previously :

```sh
  yarn add pubnub mobx
  # Or npm i pubnub mobx
```

### Install

```sh
  yarn add pubnub-mobx
  # Or npm i pubnub-mobx
```

### Usage

`pubnub-mobx` exposes only one function :

`init`

```typescript
// Optional
import PubNub from "pubnub";
import { init } from "pubnub-mobx";

const { pubnub, listeners, publishers, destroy } = init({
  // Optional, use if you need to publish in addition to listening to data
  publishKey: credentials.publishKey,
  subscribeKey: credentials.subscribeKey,
  channels: ["ch1"],
  // Optional
  PubNub
});
```

### Listen to data change

```typescript
import { observe } from "mobx";
// ... Code from previous section
observe(listeners.message, ({ newValue, oldValue }) => {
  // Run any logic here on newValue to handle the data
});
```

### Map events to your own data structure

```typescript
import { computed } from "mobx";
// ... Code from previous section
const latestMessage = computed(() => {
  return { message: listeners.message.get() };
});
```

### Publish a new message

To publish a new message just `set` it in `publishers.message`

```typescript
publishers.message.set({
  channel: "ch1",
  message: {
    oh_hai: "mark"
  }
});
// That's it !

// When the message is received by the peer they can read it with :

listeners.message.get(); // { channel:"ch1", message: { oh_hai: "mark" } }
```

## API

#### init Input :

The init method expects as input an object with the following shape :

- channels: Array<string> (Required)
- subscribeKey: string (Required)
- publishKey: string (Not required)
- PubNub: Pubnub library (Not required)

#### init Output :

When called init returns an object with the shape :

- listeners: `{ "message | presence | status": ReadOnly<MobxObsevarbleBox> }`
- publishers: `{ "message | presence | status": MobxObsevarbleBox }`
- destroy: `() => void` Call this method to unsubscribe
- pubnub: `Pubnub instance` Instantiated pubnub instance

## Pubnub JS Docs

https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk

## MobX Docs

https://mobx.js.org

[circleci-href]: https://circleci.com/gh/rakannimer/pubnub-mobx
[circleci-badge]: https://img.shields.io/circleci/project/github/rakannimer/pubnub-mobx.svg
[npm-href]: https://www.npmjs.com/package/pubnub-mobx
[npm-version-badge]: https://img.shields.io/npm/v/pubnub-mobx.svg
[npm-license-badge]: https://img.shields.io/github/license/rakannimer/pubnub-mobx.svg
[bundlephobia-badge]: https://img.shields.io/bundlephobia/minzip/pubnub-mobx.svg
[bundlephobia-href]: https://bundlephobia.com/result?p=pubnub-mobx
