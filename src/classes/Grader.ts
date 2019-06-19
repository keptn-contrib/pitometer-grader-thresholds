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

import * as pitometer from 'pitometer';
import { IViolation } from 'pitometer/dist/types';
import { IIndividualGradingResult } from 'pitometer/dist/types';
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
    { thresholds, metricScore, ignoreEmpty, metadata }) {
    let score = metricScore;
    const violations: IThresholdViolation[] = [];
    const individualResult:IIndividualGradingResult = {value:result.value, key:result.key}

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
  }): pitometer.IGradingResult {
    const grades = [];
    const violations = [];
    const individualResults = []

    results.forEach((result: pitometer.ISourceResult) => {
      const grade = this.evaluate(result, {
        thresholds,
        metricScore,
        ignoreEmpty,
        metadata,
      });
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
