import * as pitometer from 'pitometer';
export declare class Grader implements pitometer.IGrader {
    grade(id: string, value: number | boolean, { thresholds, metricScore }: {
        thresholds: any;
        metricScore: any;
    }, context: any): pitometer.IGradingResult;
}
