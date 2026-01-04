import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export const scenes = [
  { id: "lakes", name: "Lakes" },
  { id: "glow", name: "Glow" },
  { id: "liquill", name: "Liquill" }
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export function getSceneById(id: string) {
  return scenes.find((scene) => scene.id === id);
}

export type SceneButtonSlot = Snippet<
  [
    {
      onClick: HTMLButtonAttributes["onclick"];
    }
  ]
>;

export function createSceneFactory<
  T extends new (...args: any[]) => any
>(Scene: T) {
  return ({
    onMount,
    showGui
  }: {
    onMount: (arg: () => void) => void;
    showGui?: boolean;
  }) => {
    let scene: InstanceType<T> | undefined = new Scene();

    onMount(() => {
      scene?.init();
      scene?.render();

      if (showGui) {
        scene?.gui.show();
      }

      return () => {
        scene?.destroy();
      };
    });

    return scene;
  };
}
