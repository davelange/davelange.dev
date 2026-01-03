export const scenes = [
  { id: "lakes", name: "Lakes" },
  { id: "glow", name: "Glow" }
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export function getSceneById(id: string) {
  return scenes.find((scene) => scene.id === id);
}
