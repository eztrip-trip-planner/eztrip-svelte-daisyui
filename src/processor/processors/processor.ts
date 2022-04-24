import type { Constructor } from '@eztrip/types';
import { File } from '../file';
import { Pipeline } from '../pipes/pipeline';
import minimist from 'minimist';
import type { Pipe } from '../pipes/pipe';
import type { AddPipelineFunction } from './types/add-pipeline-function.type';
import type { PipelineEventFunction } from './types/pipeline-event-function.type';
import type { AddPipelineEventFunction } from './types/add-pipeline-event-function.type';

type ProcessorConstructor = Constructor<Processor, [string, string]>;

/**
 * Processor mode.
 */
export abstract class Processor {
    /**
     * Modes.
     */
    private static readonly modes: Map<string, ProcessorConstructor> =
        new Map();

    /**
     * Registers a mode class for the given name.
     * @param name Name of the mode.
     * @param mode Mode class.
     */
    public static register(name: string, mode: ProcessorConstructor): void {
        Processor.modes.set(name, mode);
    }

    /**
     * Parses the command line arguments.
     * @returns The parsed arguments.
     */
    public static parseArgv() {
        const args = minimist(process.argv.slice(2), {
            alias: {
                mode: 'm',
                input: 'i',
                output: ['o', 'out'],
            },
        });

        // if (!args._[0] || !args.mode || !args.output || !args.input)
        //     throw new Error('Missing required arguments: mode, input, output');

        return args;
    }

    /**
     * Starts the mode.
     */
    public static start(): void {
        const args = Processor.parseArgv();

        const ModeClass = Processor.modes.get(args.mode);
        if (!ModeClass) throw new Error(`Unknown mode name: ${args.mode}`);

        const mode = new ModeClass(args._[0], args.output);
        if (mode.setupPipelines)
            mode.setupPipelines(mode.addPipeline.bind(mode));
        if (mode.setupEvents)
            mode.setupEvents(mode.subscribePipeline.bind(mode));
        mode.start(mode.input, mode.output);
    }

    /**
     * File instance.
     */
    protected readonly file: File = File.getInstance();

    /**
     * Set of pipelines.
     */
    private readonly pipelines: Map<string, Array<Pipeline>> = new Map();

    private readonly events: Map<string, PipelineEventFunction> = new Map();

    private readonly input: string;

    private readonly output: string;

    public constructor(input: string, output: string) {
        this.input = this.file.normalize(input);
        this.output = this.file.normalize(output);
    }

    /**
     * Adds a pipeline to the processor.
     * @param name Name of the pipeline.
     * @param extensions Extensions that the pipeline supports.
     * @param pipes Array of pipes.
     */
    private addPipeline(
        name: string,
        pipes: ReadonlyArray<Pipe>,
        extensions: Array<string>,
        transformExtension?: string,
    ): void {
        const pipeline = new Pipeline(name, extensions, transformExtension);
        pipeline.addPipe(...pipes);

        for (const ext of extensions)
            this.pipelines.set(ext, [
                ...(this.pipelines.get(ext) ?? []),
                pipeline,
            ]);
    }

    private subscribePipeline(
        names: Array<string>,
        fn: PipelineEventFunction,
    ): void {
        for (const name of names) this.events.set(name, fn);
    }

    protected async process(filePath: string) {
        const fileExtension = this.file.getExtension(filePath);
        const source = this.file.read(filePath);

        for (const pipeline of this.pipelines.get(fileExtension) ?? []) {
            const transformExtension = pipeline.transformExtension;
            const processedSource = await pipeline.process(filePath, source);
            const filePathWithoutInput = filePath.replace(this.input, '');
            const fileName = this.file.getName(filePath);
            const transformedFilePath = this.file.changeExtension(
                filePath,
                transformExtension ?? fileExtension,
            );

            const event = this.events.get(pipeline.name);
            if (!event) continue;

            await event({
                input: this.input,
                output: this.output,
                source,
                processedSource,
                filePath,
                filePathWithoutInput,
                fileName,
                transformed: {
                    filePath: transformedFilePath,
                    filePathWithoutInput: transformedFilePath.replace(
                        this.input,
                        '',
                    ),
                    fileName: this.file.getName(transformedFilePath),
                },
            });
        }
    }

    /**
     * Setups the pipelines.
     */
    public setupPipelines?(add: AddPipelineFunction): void;

    public setupEvents?(add: AddPipelineEventFunction): void;

    /**
     * Starts the mode.
     * @param input Input directory.
     * @param output Output directory.
     */
    public abstract start(input: string, output: string): Promise<void>;
}
