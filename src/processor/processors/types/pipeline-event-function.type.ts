import type { ProcessedData } from './processed-data.interface';

export type PipelineEventFunction = (data: ProcessedData) => Promise<void>;
