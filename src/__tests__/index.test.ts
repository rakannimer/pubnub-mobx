import PN from "pubnub";
import { waitUntil } from "../test-utils";
import { init } from "..";
import { credentials } from "../credentials";
const TEST_TIMEOUT = 20000;

describe("pubnub-mobx", () => {
  const TEST_MESSAGE = {
    message: {
      such: "object"
    },
    channel: "ch1",
    sendByPost: false, // true to send via post
    storeInHistory: false //override default storage options
  };
  test(
    "messages work",
    async () => {
      const { pubnub, listeners, publishers, destroy } = init({
        publishKey: credentials.publishKey,
        subscribeKey: credentials.subscribeKey,
        channels: ["ch1"],
        PubNub: PN
      });
      expect(pubnub).toBeTruthy();
      expect(listeners).toBeTruthy();
      expect(publishers).toBeTruthy();
      publishers.message.set(TEST_MESSAGE as any);
      await waitUntil(listeners.message, ({ oldValue, newValue }) => {
        return !!newValue;
      });
      // expect(publishers.message.get()).toEqual({});
      const message = listeners.message.get();
      if (message === null) {
        throw new Error("Message was not added to listeners");
      }
      expect(message.message).toEqual(TEST_MESSAGE.message);
      destroy();
    },
    TEST_TIMEOUT
  );
  test(
    "status works",
    async () => {
      const { pubnub, listeners, publishers, destroy } = init({
        publishKey: credentials.publishKey,
        subscribeKey: credentials.subscribeKey,
        channels: ["ch1"],
        PubNub: PN
      });
      expect(pubnub).toBeTruthy();
      expect(listeners).toBeTruthy();
      expect(publishers).toBeTruthy();
      publishers.message.set(TEST_MESSAGE as any);
      await waitUntil(listeners.status, ({ oldValue, newValue }) => {
        return !!newValue;
      });
      const status = listeners.status.get();
      if (status === null) {
        throw new Error("status was not added to listeners");
      }
      expect(status.affectedChannels).toEqual(["ch1"]);
      expect(status.category).toEqual("PNConnectedCategory");
      expect(status.operation).toEqual("PNSubscribeOperation");
      destroy();
    },
    TEST_TIMEOUT
  );
});
