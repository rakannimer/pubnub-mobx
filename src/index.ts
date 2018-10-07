import PN from "pubnub";
import { observable, observe, IObservableValue } from "mobx";

type InitArgs = {
  publishKey?: string;
  subscribeKey: string;
  PubNub?: typeof PN;
  channels: string[];
};

export const getPubnubListener = (
  message: IObservableValue<any>,
  presence: IObservableValue<any>,
  status: IObservableValue<any>
) => {
  return {
    message: function(m: PN.MessageEvent) {
      const {
        actualChannel,
        publisher,
        channel,
        timetoken,
        message: thisMessage,
        subscription,
        subscribedChannel
      } = m;
      message.set({
        actualChannel,
        publisher,
        channel,
        timetoken,
        message: thisMessage,
        subscription,
        subscribedChannel
      });
    },
    presence: function(p: PN.PresenceEvent) {
      presence.set(p);
    },
    status: function(s: PN.StatusEvent) {
      status.set(s);
    }
  };
};

export const init = ({
  publishKey,
  subscribeKey,
  PubNub = PN,
  channels
}: InitArgs) => {
  const pubnub = new PubNub({
    publishKey,
    subscribeKey
  });
  const message = observable.box(null as null | PN.MessageEvent);
  const presence = observable.box(null as null | PN.PresenceEvent);
  const status = observable.box(null as null | PN.StatusEvent);
  const pubnubListener = getPubnubListener(message, presence, status);

  const publishers = {
    message: observable.box(null) as typeof message
  };
  const listeners = {
    message,
    presence,
    status
  };
  observe(publishers.message, ({ oldValue, newValue }) => {
    if (!!newValue) {
      pubnub.publish(newValue);
    }
  });
  pubnub.addListener(pubnubListener);
  pubnub.subscribe({ channels });

  const destroy = () => {
    pubnub.removeListener(pubnubListener);
    pubnub.unsubscribe({ channels });
  };
  return { pubnub, listeners, publishers, destroy };
};

export default init;
