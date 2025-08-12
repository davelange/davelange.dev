type Subscriber = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (args: any) => void;
  id?: string;
};
type SubsObject<T extends string> = Record<T, Subscriber[]>;
type SubscribeFn<TEvent> = (
  event: TEvent,
  fn: Subscriber["fn"],
  id?: Subscriber["id"]
) => void;
type SubscriberAction = (id: string) => () => void;
type PublishFn<TEvent> = (event: TEvent, data?: unknown) => void;

export function createPubSub<TEvent extends string>(
  events: TEvent[]
) {
  const subs = events.reduce(
    (acc, val) => ({ ...acc, [val]: [] }),
    {} as SubsObject<TEvent>
  );

  const publish: PublishFn<TEvent> = (event, data) => {
    subs[event].forEach((sub) => sub.fn(data));
  };

  const off = (id: string) => {
    console.log("cleanup", id);
    events.forEach((evt) => {
      subs[evt] = subs[evt].filter((sub) => sub.id !== id);
    });
  };

  const internalSubscribe: SubscribeFn<TEvent> = (event, fn, id) => {
    subs[event].push({ fn, id });
  };

  const _on = (defaultId: string): SubscribeFn<TEvent> => {
    return (event, fn, id = defaultId) =>
      internalSubscribe(event, fn, id);
  };

  const on = (event: TEvent, fn: Subscriber["fn"]) => {
    subs[event].push({ fn });
  };

  const cleanup: SubscriberAction = (defaultId: string) => {
    return (id = defaultId) => off(id);
  };

  const managedSubscriber = () => {
    const id = crypto.randomUUID();

    return {
      on: _on(id),
      off,
      cleanup: cleanup(id)
    };
  };

  return { publish, on, off, cleanup, managedSubscriber, subs: subs };
}
