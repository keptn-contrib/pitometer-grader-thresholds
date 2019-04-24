"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
class Grader {
    setOptions(options) {
        this.context = options.context;
    }
    evaluate(result, { thresholds, metricScore, ignoreEmpty }) {
        if ((typeof (result) === 'boolean') || !result.value) {
            if (ignoreEmpty) {
                return false;
            }
            return {
                score: 0,
                violations: [
                    {
                        key: typeof (result) === 'boolean' ? '' : result.key,
                        value: false,
                        breach: 'The indicator returned no value for the current key',
                    },
                ],
            };
        }
        let score = metricScore;
        const violations = [];
        const value = result.value;
        if (thresholds.lowerSevere && value <= thresholds.lowerSevere) {
            score = 0;
            violations.push({
                value,
                key: result.key,
                breach: 'lowerSevere',
                threshold: thresholds.lowerSevere,
            });
        }
        else if (thresholds.lowerWarning && value <= thresholds.lowerWarning) {
            score /= 2;
            violations.push({
                value,
                key: result.key,
                breach: 'lowerWarning',
                threshold: thresholds.lowerWarning,
            });
        }
        if (thresholds.upperSevere && value >= thresholds.upperSevere) {
            score = 0;
            violations.push({
                value,
                key: result.key,
                breach: 'upperSevere',
                threshold: thresholds.upperSevere,
            });
        }
        else if (thresholds.upperWarning && value >= thresholds.upperWarning) {
            score /= 2;
            violations.push({
                value,
                key: result.key,
                breach: 'upperWarning',
                threshold: thresholds.upperWarning,
            });
        }
        return {
            score,
            violations,
        };
    }
    grade(id, results, { thresholds, metricScore, ignoreEmpty }) {
        if (!results) {
            return {
                id,
                score: 0,
                violations: [{ breach: 'The indicator returned no values' }],
            };
        }
        const grades = [];
        const violations = [];
        results.forEach((result) => {
            const grade = this.evaluate(result, { thresholds, metricScore, ignoreEmpty });
            if (grade === false)
                return false;
            violations.push(...grade.violations);
            grades.push({
                id,
                key: result.key,
                value: result.value,
                score: grade.score,
                violations: grade.violations,
            });
        });
        const reduced = grades.reduce((acc, elm) => {
            return (!acc || elm.score < acc.score) ? elm : acc;
            return acc;
        }, null);
        return { id, violations, score: reduced ? reduced.score : metricScore };
    }
}
exports.Grader = Grader;
//# sourceMappingURL=Grader.js.map