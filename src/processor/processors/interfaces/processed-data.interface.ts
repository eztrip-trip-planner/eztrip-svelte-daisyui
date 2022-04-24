export interface ProcessedData {
    input: string;
    output: string;
    source: string;
    processedSource: string;
    filePath: string;
    filePathWithoutInput: string;
    fileName: string;
    transformed: {
        filePath: string;
        filePathWithoutInput: string;
        fileName: string;
    };
}
