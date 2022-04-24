import { JavascriptPipe } from '../pipes/javascript.pipe';
import { PostCssPipe } from '../pipes/postcss.pipe';
import { RtlCssPipe } from '../pipes/rtlcss.pipe';
import { SassPipe } from '../pipes/sass.pipe';
import { SveltePipe } from '../pipes/svelte.pipe';
import { Processor } from './processor';
import tailwindcss from 'tailwindcss';
import { TailwindConfig } from '../../configs/tailwind.config';
import autoprefixer from 'autoprefixer';
import type { AddPipelineFunction } from './types/add-pipeline-function.type';
import type { AddPipelineEventFunction } from './types/add-pipeline-event-function.type';

/**
 * Processor for building the daisyUI components.
 */
export class BuildProcessor extends Processor {
    public setupPipelines(add: AddPipelineFunction): void {
        add('svelte', [new SveltePipe()], ['.svelte']);
        add('javascript', [new JavascriptPipe()], ['.js']);
        add(
            'css',
            [
                new SassPipe(),
                new PostCssPipe(tailwindcss(TailwindConfig), autoprefixer()),
            ],
            ['.scss', '.sass'],
            '.css',
        );
        add(
            'rtlcss',
            [
                new SassPipe(),
                new PostCssPipe(tailwindcss(TailwindConfig), autoprefixer()),
                new RtlCssPipe(),
            ],
            ['.scss', '.sass'],
            '.css',
        );
    }

    public async start(input: string): Promise<void> {
        const files = this.file.readDirRecursively(input);
        for (const filePath of files) await this.process(filePath);
    }

    public setupEvents(add: AddPipelineEventFunction): void {
        add(['svelte', 'javascript'], async (data) => {
            const { transformed, processedSource, output } = data;
            const { filePathWithoutInput } = transformed;

            const mainOutputPath = this.file.join(
                output,
                'main',
                filePathWithoutInput,
            );
            const rtlOutputPath = this.file.join(
                output,
                'rtl',
                filePathWithoutInput,
            );

            this.file.write(mainOutputPath, processedSource);
            this.file.write(rtlOutputPath, processedSource);
        });

        add(['css'], async (data) => {
            const { transformed, processedSource, output } = data;
            const { filePathWithoutInput } = transformed;

            const mainOutputPath = this.file.join(
                output,
                'main',
                filePathWithoutInput,
            );

            this.file.write(mainOutputPath, processedSource);
        });

        add(['rtlcss'], async (data) => {
            const { transformed, processedSource, output } = data;
            const { filePathWithoutInput } = transformed;

            const rtlOutputPath = this.file.join(
                output,
                'rtl',
                filePathWithoutInput,
            );

            this.file.write(rtlOutputPath, processedSource);
        });
    }
}
