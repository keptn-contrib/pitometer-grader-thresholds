"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Grader {
    grade(id, value, { thresholds, metricScore }, context) {
        if (value === false) {
            return {
                id,
                value,
                score: 0,
                violations: [
                    { breach: 'The indicator returned no value' },
                ],
            };
        }
        let score = metricScore;
        // const query = source.query;
        const violations = [];
        if (thresholds.lowerSevere && value <= thresholds.lowerSevere) {
            score = 0;
            violations.push({
                breach: 'lower_critical',
                comparison: 'fixed',
                threshold: thresholds.lowerSevere,
            });
        }
        else if (thresholds.lowerWarning && value <= thresholds.lowerWarning) {
            score /= 2;
            violations.push({
                breach: 'lower_warning',
                comparison: 'fixed',
                threshold: thresholds.lowerWarning,
            });
        }
        if (thresholds.upperSevere && value >= thresholds.upperSevere) {
            score = 0;
            violations.push(violations.push({
                breach: 'upper_critical',
                comparison: 'fixed',
                threshold: thresholds.upperSevere,
            }));
        }
        else if (thresholds.upperWarning && value >= thresholds.upperWarning) {
            score /= 2;
            violations.push(violations.push({
                breach: 'upper_warning',
                comparison: 'fixed',
                threshold: thresholds.upperWarning,
            }));
        }
        return { id, value, score, violations };
    }
}
exports.Grader = Grader;
//# sourceMappingURL=Grader.js.map