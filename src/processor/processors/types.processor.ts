import { Processor } from './processor';
import { sveld } from 'sveld';
import type { AddPipelineFunction } from './types/add-pipeline-function.type';
import type { AddPipelineEventFunction } from './types/add-pipeline-event-function.type';

export class TypesProcessor extends Processor {
    public setupPipelines(add: AddPipelineFunction): void {}

    public setupPipelineEvents(add: AddPipelineEventFunction): void {}

    public async start(input: string, output: string): Promise<void> {
        await sveld({ input, typesOptions: { outDir: output } });
    }
}
