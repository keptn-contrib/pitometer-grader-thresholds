import { expect } from 'chai';
import 'mocha';
import { Grader } from './Grader';

const testUpperWarningSingle = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 42,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 10,
    ignoreEmpty: false,
  },
};

const testUpperSevereSingle = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 53,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 10,
    ignoreEmpty: false,
  },
};

const testLowerWarningeSingle = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 20,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 15,
    ignoreEmpty: false,
  },
};

const testLowerSevereSingle = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 9,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 20,
    ignoreEmpty: false,
  },
};

const testPassSingle = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 30,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 20,
    ignoreEmpty: false,
  },
};

const testUpperLowerCollision = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 35,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 30, upperWarning: 20, lowerSevere: 50, lowerWarning: 25 },
    metricScore: 20,
    ignoreEmpty: false,
  },
};

const testZeroValue = {
  id: 'Throughput_Booking',
  results: [{
    key: 'SERVICE-84977E8DCF605164',
    timestamp: 1557796260000,
    value: 0,
  }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 30 },
    metricScore: 20,
    ignoreEmpty: false,
  },
};

const testEmptyResults = {
  id: 'Throughput_Booking',
  results: [],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 30 },
    metricScore: 20,
    ignoreEmpty: false,
  },
};

const testIgnoreEmptyResults = {
  id: 'Throughput_Booking',
  results: [],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 30 },
    metricScore: 20,
    ignoreEmpty: true,
  },
};

describe('ThresholdGrader', () => {

  it('store a context set via setOptions', async () => {
    const test = testUpperWarningSingle;
    const grader = new Grader();
    grader.setOptions({
      context: 'Test',
      timeStart: 0,
      timeEnd: 0,
    });
    const context = grader.getContext();
    expect(context).to.equal('Test');
  });

  it('should detect annd grade upper warning on a single entity', async () => {
    const test = testUpperWarningSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('upperWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.score).to.equal(test.grading.metricScore / 2);
  });

  it('should detect annd grade upper severe breach on a single entity', async () => {
    const test = testUpperSevereSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('upperSevere');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.score).to.equal(0);
  });

  it('should detect annd grade lower warning on a single entity', async () => {
    const test = testLowerWarningeSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('lowerWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.score).to.equal(test.grading.metricScore / 2);
  });

  it('should detect annd grade upper severe breach on a single entity', async () => {
    const test = testLowerSevereSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('lowerSevere');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.score).to.equal(0);
  });

  it('should detect two violations if upper and lower boundaries are contradictive', async () => {
    const test = testUpperLowerCollision;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations.length).to.equal(2);
  });

  it('should report a violation if result is empty', async () => {
    const test = testEmptyResults;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('The indicator returned no values');
    expect(result.score).to.equal(0);
  });

  it('should report a violation if result is empty and ignoreEmpty is true', async () => {
    const test = testIgnoreEmptyResults;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations).to.be.empty;
    expect(result.score).to.equal(test.grading.metricScore);
  });

  it('should detect annd grade a single result with no violation', async () => {
    const test = testPassSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations).to.be.empty;
    expect(result.score).to.equal(test.grading.metricScore);
  });
});
