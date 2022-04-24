import chokidar from 'chokidar';
import { BuildProcessor } from './build.processor';

export class WatchProcessor extends BuildProcessor {
    public override async start(input: string): Promise<void> {
        const watcher = chokidar.watch(input);
        watcher.on('add', this.process.bind(this));
        watcher.on('change', this.process.bind(this));
        watcher.on('unlink', this.process.bind(this));
    }
}
