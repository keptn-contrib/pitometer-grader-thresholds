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

export class Grader implements pitometer.IGrader {
  private context: string;

  public setOptions(options: pitometer.IOptions) {
    this.context = options.context;
  }

  private evaluate(result, { thresholds, metricScore }) {
    if (result === false || !result.value) {
      return {
        score: 0,
        violations: [
          { breach: 'The indicator returned no value' },
        ],
      };
    }

    let score = metricScore;
    // const query = source.query;
    const violations = [];
    const value = result.value;

    if (thresholds.lowerSevere && value <= thresholds.lowerSevere) {
      score = 0;
      violations.push({
        key: result.key,
        breach: 'lower_critical',
        comparison: 'fixed',
        threshold: thresholds.lowerSevere,
      });
    } else if (thresholds.lowerWarning && value <= thresholds.lowerWarning) {
      score /= 2;
      violations.push({
        key: result.key,
        breach: 'lower_warning',
        comparison: 'fixed',
        threshold: thresholds.lowerWarning,
      });
    }

    if (thresholds.upperSevere && value >= thresholds.upperSevere) {
      score = 0;
      violations.push({
        key: result.key,
        breach: 'upper_critical',
        comparison: 'fixed',
        threshold: thresholds.upperSevere,
      });
    } else if (thresholds.upperWarning && value >= thresholds.upperWarning) {
      score /= 2;
      violations.push({
        key: result.key,
        breach: 'upper_warning',
        comparison: 'fixed',
        threshold: thresholds.upperWarning,
      });
    }

    return {
      score,
      violations,
    };
  }

  grade(id: string, results: pitometer.ISourceResult[], { thresholds, metricScore })
    : pitometer.IGradingResult {

    if (!results) {
      return {
        id, value: false, score: 0,
        violations: [{ breach: 'The indicator returned no value' }]
      };
    }

    const grades = [];
    results.forEach((result: any) => {
      const grade = this.evaluate(result, { thresholds, metricScore });

      grades.push({
        id,
        key: result.key,
        value: result.value,
        score: grade.score,
        violations: grade.violations,
      });
    });

    const reduced = grades.reduce((acc, elm) => {
      acc = (!acc || elm.score < acc.score) ? elm : acc;
      return acc;
    }, null);

    return { id, value: reduced.value, score: reduced.score, violations: reduced.violations };
  }
}
