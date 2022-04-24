import type { Pipe } from './pipe';

/**
 * Utility class for processing files through pipes.
 */
export class Pipeline {
    /**
     * Pipeline name.
     */
    public readonly name: string;

    /**
     * Array of extensions that are supported by the pipeline.
     */
    public readonly extensions: ReadonlyArray<string>;

    public readonly transformExtension?: string;

    /**
     * Array of pipes. The order of the pipes is important.
     */
    private pipes: Array<Pipe> = [];

    public constructor(
        name: string,
        extensions: Array<string>,
        transformExtension?: string,
    ) {
        this.name = name;
        this.extensions = extensions;
        this.transformExtension = transformExtension;
    }

    /**
     * Adds a pipe to the pipeline.
     * @param pipes Pipe to add.
     */
    public addPipe(...pipes: ReadonlyArray<Pipe>) {
        this.pipes.push(...pipes);
    }

    /**
     *
     * @param filePath
     * @param source
     * @returns
     */
    public async process(filePath: string, source: string): Promise<string> {
        let processedSource = source;
        for (const pipe of this.pipes)
            processedSource = await pipe.process({
                filePath,
                source: processedSource,
            });
        return processedSource;
    }
}
