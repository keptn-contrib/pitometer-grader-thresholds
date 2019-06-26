/**
 * Copyright 2019, Dynatrace
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as pitometer from '../../../pitometer';
import { IIndividualGradingResult } from '../../../pitometer/dist/types';
import { IThresholdViolation } from '../types';

export class Grader implements pitometer.IGrader {
  private context: string;
  private individualResults: boolean;

  public setOptions(options: pitometer.IOptions) {
    this.context = options.context;
    this.individualResults = options.individualResults ? options.individualResults : false;
  }

  public getContext() {
    return this.context;
  }

  private evaluate(
    result: pitometer.ISourceResult,
    { thresholds, metricScore, ignoreEmpty, metadata },
    individualCompareResult: pitometer.IIndividualGradingResult) {
    let score = metricScore;
    const violations: IThresholdViolation[] = [];
    const individualResult:IIndividualGradingResult = {value:result.value, key:result.key}

    // lets see if we have been passed an individual grading result
    if(individualCompareResult) {
      // console.log("we have something to compare: " + JSON.stringify(individualCompareResult));

      // If we have a comparison dataset the Threshold Grader support specifying upperSeverePerc, upperWarningPerc, lowerWarningPerc, lowerSeverePerc
      // if those are specified we calculate them based on the previous run data
      if(thresholds.upperSeverePerc) thresholds.upperSevere = individualCompareResult.value * (100+thresholds.upperSeverePerc) / 100;
      if(thresholds.upperWarningPerc) thresholds.upperWarning = individualCompareResult.value * (100+thresholds.upperWarningPerc) / 100;
      if(thresholds.lowerWarningPerc) thresholds.lowerWarning = individualCompareResult.value * (100-thresholds.lowerWarningPerc) / 100;
      if(thresholds.lowerSeverePerc) thresholds.lowerSevere = individualCompareResult.value * (100-thresholds.lowerSeverePerc) / 100;

      console.log("Actual Thresholds: " + JSON.stringify(thresholds));
    }

    if (thresholds.lowerSevere && individualResult.value <= thresholds.lowerSevere) {
      score = 0;
      violations.push({
        metadata,
        value: individualResult.value,
        key: individualResult.key,
        breach: 'lowerSevere',
        threshold: thresholds.lowerSevere,
      });
    } else if (thresholds.lowerWarning && individualResult.value <= thresholds.lowerWarning) {
      score /= 2;
      violations.push({
        metadata,
        value: individualResult.value,
        key: individualResult.key,
        breach: 'lowerWarning',
        threshold: thresholds.lowerWarning,
      });
    }

    if (thresholds.upperSevere && individualResult.value >= thresholds.upperSevere) {
      score = 0;
      violations.push({
        metadata,
        value: individualResult.value,
        key: individualResult.key,
        breach: 'upperSevere',
        threshold: thresholds.upperSevere,
      });
    } else if (thresholds.upperWarning && individualResult.value >= thresholds.upperWarning) {
      score /= 2;
      violations.push({
        metadata,
        value: individualResult.value,
        key: individualResult.key,
        breach: 'upperWarning',
        threshold: thresholds.upperWarning,
      });
    }

    if(this.individualResults) {
      if(thresholds.lowerSevere) individualResult.lowerSevere = thresholds.lowerSevere;
      if(thresholds.lowerWarning) individualResult.lowerWarning = thresholds.lowerWarning;
      if(thresholds.upperSevere) individualResult.upperSevere = thresholds.upperSevere;
      if(thresholds.upperWarning) individualResult.upperWarning = thresholds.upperWarning;

      return {score, violations, individualResult};
    }

    return {
      score,
      violations
    };
  }

  grade(id: string, results: pitometer.ISourceResult[], {
    thresholds,
    metricScore,
    ignoreEmpty,
    metadata,
  }, compareResult): pitometer.IGradingResult {
    const grades = [];
    const violations = [];
    const individualResults = []

    results.forEach((result: pitometer.ISourceResult) => {

      // lets see if we have an individual compare result for that source key
      var individualResult:pitometer.IIndividualGradingResult = null;
      if(compareResult && compareResult.individualResults) {
        for(var i=0;i<compareResult.individualResults.length;i++) {
          if(compareResult.individualResults[i].key == result.key)
            individualResult = compareResult.individualResults[i];
            break;
        }
      }

      const grade = this.evaluate(result, {
        thresholds,
        metricScore,
        ignoreEmpty,
        metadata,
      }, individualResult);
      violations.push(...grade.violations);
      grades.push({
        id,
        key: result.key,
        value: result.value,
        score: grade.score,
        violations: grade.violations,
      });
      if(this.individualResults)
        individualResults.push(grade.individualResult);
    });

    const reduced = grades.reduce((acc, elm) => {
      return (!acc || elm.score < acc.score) ? elm : acc;
      // tslint:disable-next-line: align
    }, null);

    let score = 0;
    if (reduced) {
      score = reduced.score;
    } else if (ignoreEmpty) {
      score = metricScore;
    } else {
      violations.push({
        metadata,
        breach: 'The indicator returned no values',
      });
    }

    if(this.individualResults)
      return { id, violations, score, individualResults };

    return { id, violations, score};
  }
}
