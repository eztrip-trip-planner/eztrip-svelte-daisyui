import { Pipe, type PipeData } from './pipe';

export class ThemesPipe extends Pipe {
    public process(data: PipeData): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
