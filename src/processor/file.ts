import fs from 'fs';
import path from 'path';

/**
 * Utility class for file processing.
 */
export class File {
    /**
     * File instance.
     */
    private static instance: File = new File();

    /**
     * Returns the instance of the File class.
     * @returns The instance of the File class.
     */
    public static getInstance(): File {
        if (!this.instance) this.instance = new File();
        return File.instance;
    }

    /**
     * Reads files from the specified directory recursively and returns an array of file paths.
     * @param dir Path to the directory.
     * @returns Array of file paths.
     */
    public readDirRecursively(dir: string): string[] {
        const files = fs.readdirSync(dir);
        const result = [] as string[];
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory())
                result.push(...this.readDirRecursively(filePath));
            else result.push(filePath);
        }
        return result;
    }

    /**
     * Writes the specified file to the output directory.
     * @param filePath Path to the file.
     * @param content Content to be written to the file.
     */
    public write(filePath: string, content: string): void {
        const dirName = path.dirname(filePath);

        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });

        fs.writeFileSync(filePath, content);
    }

    /**
     * Reads the specified file and returns its content.
     * @param filePath Path to the file
     */
    public read(filePath: string): string {
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
    }

    /**
     * Removes the specified file from the output directory.
     * @param filePath Path to the file
     */
    public remove(filePath: string): void {
        if (!fs.existsSync(filePath)) return;
        fs.unlinkSync(filePath);
    }

    /**
     * Gets the file's extension.
     */
    public getExtension(filePath: string): string {
        return path.extname(filePath);
    }

    public getName(filePath: string): string {
        return path.basename(filePath);
    }

    public join(...paths: Array<string>) {
        return path.join(...paths);
    }

    public resolve(...pathSegments: Array<string>) {
        return path.resolve(...pathSegments);
    }

    public getRelative(from: string, to: string) {
        return path.relative(from, to);
    }

    public normalize(p: string) {
        return path.normalize(p);
    }

    public changeExtension(filePath: string, extension: string) {
        return this.join(
            path.dirname(filePath),
            this.getName(filePath).replace(
                this.getExtension(filePath),
                extension,
            ),
        );
    }
}
