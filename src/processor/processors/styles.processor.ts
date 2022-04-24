import type { AddPipelineEventFunction } from './types/add-pipeline-event-function.type';
import type { AddPipelineFunction } from './types/add-pipeline-function.type';
import { Processor } from './processor';

/**
 * Processor for building base and themes styles.
 */
export class StylesProcessor extends Processor {
    public setupPipelines(add: AddPipelineFunction): void {}

    public setupEvents(add: AddPipelineEventFunction): void {}

    public async start(input: string, output: string): Promise<void> {
        const files = this.file.readDirRecursively(input);
    }
}
