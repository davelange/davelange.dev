import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

export const scenes = [
  { id: "lakes", name: "Lakes", path: "lakes-scene" },
  { id: "glow", name: "Glow", path: "glow-scene" },
  { id: "liquill", name: "Liquill", path: "liquill-scene" }
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export function getSceneById(id: string) {
  return scenes.find((scene) => scene.id === id);
}

export function getSceneByPath(path: string) {
  return scenes.find((scene) => scene.path === path);
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
