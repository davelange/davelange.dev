import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Gets a list of all files in the ./blog directory
 * @returns Array of filenames (without path)
 */
export function getBlogFiles(): string[] {
  try {
    const blogPath = join(process.cwd(), "src", "content", "blog");
    const files = readdirSync(blogPath);

    // Filter out directories and return only files
    return files
      .filter((file: string) => {
        const filePath = join(blogPath, file);
        return statSync(filePath).isFile();
      })
      .map((file: string) => file.replace(".mdx", ""));
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

/**
 * Gets the contents of a file
 * @param path - Path to the file
 * @returns The contents of the file as a string, or null if there was an error
 */
export function getFileContents(path: string): string | null {
  try {
    return readFileSync(join(process.cwd(), "src", "content", "blog", `${path}.mdx`), "utf-8");
  } catch (error) {
    console.error(`Error reading file ${path}:`, error);
    return null;
  }
}
