import { createPubSub } from "./pub";

const pub = createPubSub([
  "enteredSection",
  "scrolledUpFromSection",
  "scrolledDownFromSection"
]);

class ProseObserverManager {
  private observers: Map<string, ProseObserver> = new Map();

  createObserver(key: string) {
    const observer = new ProseObserver();
    this.observers.set(key, observer);
    return observer;
  }

  destroyObserver(key: string) {
    this.observers.get(key)?.destroy();
    this.observers.delete(key);
  }

  getObserver(key: string) {
    return this.observers.get(key);
  }
}

export const proseObserverManager = new ProseObserverManager();

export class ProseObserver {
  private observer: IntersectionObserver | null = null;
  entryMap = new Map<string, boolean>();

  setup() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!this.entryMap.get(entry.target.id)) {
          this.entryMap.set(entry.target.id, true);
          return;
        }

        const sectionId = entry.target.getAttribute("id");

        if (!sectionId) return;

        if (entry.isIntersecting) {
          pub.publish("enteredSection", sectionId);
        }

        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.y > 0) {
            pub.publish("scrolledUpFromSection", sectionId);
          } else {
            pub.publish("scrolledDownFromSection", sectionId);
          }
        }
      });
    });

    const headings = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    headings.forEach((heading) => {
      this.entryMap.set(heading.id, false);
      this.observer?.observe(heading);
    });
    document
      .querySelectorAll("[data-article-header]")
      .forEach((header) => {
        this.entryMap.set(header.id, false);
        this.observer?.observe(header);
      });
  }

  destroy() {
    this.observer?.disconnect();
    this.entryMap.clear();
  }

  on = pub.on;
}

export const createProseObserver = ({
  key,
  onMount,
  onDestroy
}: {
  key: string;
  onMount: (cb: () => void) => void;
  onDestroy: (cb: () => void) => void;
}) => {
  const proseObserver = proseObserverManager.createObserver(key);

  onMount(() => {
    proseObserver.setup();
  });

  onDestroy(() => {
    proseObserverManager.destroyObserver(key);
  });

  return proseObserver;
};
