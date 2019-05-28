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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
  },
};

const testUpperWarningMultiple = {
  id: 'Throughput_Booking',
  results: [
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 42,
    },
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 30,
    },
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 42,
    },
  ],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 10,
    ignoreEmpty: false,
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
  },
};

const testWarningSevereMix = {
  id: 'Throughput_Booking',
  results: [
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 42,
    },
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 30,
    },
    {
      key: 'SERVICE-84977E8DCF605164',
      timestamp: 1557796260000,
      value: 55,
    },
  ],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 10,
    ignoreEmpty: false,
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
  },
};

const testPassMultiple = {
  id: 'Throughput_Booking',
  results: [
    {
      key: 'SERVICE-84977E8DCF6051641',
      timestamp: 1557796260000,
      value: 30,
    },
    {
      key: 'SERVICE-84977E8DCF6051642',
      timestamp: 1557796260000,
      value: 31,
    },
    {
      key: 'SERVICE-84977E8DCF6051643',
      timestamp: 1557796260000,
      value: 32,
    },
    {
      key: 'SERVICE-84977E8DCF6051644',
      timestamp: 1557796260000,
      value: 33,
    }],
  grading: {
    type: 'Threshold',
    thresholds: { upperSevere: 50, upperWarning: 40, lowerSevere: 10, lowerWarning: 20 },
    metricScore: 20,
    ignoreEmpty: false,
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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
    metadata: {
      playbookhints: [
        'autoFix.playbook.yml',
      ],
      keyContacts: [
        {
          name: 'Chris',
          phone: '+643 345 6789',
        },
        {
          name: 'Diane',
          phone: '+646 678 9012',
        },
      ],
    },
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

  it('should detect and grade upper warning on a single entity', async () => {
    const test = testUpperWarningSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('upperWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(test.grading.metricScore / 2);
  });

  it('should detect and grade upper warning on multiple entities', async () => {
    const test = testUpperWarningMultiple;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('upperWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(test.grading.metricScore / 2);
  });

  it('should detect and grade upper severe breach on a single entity', async () => {
    const test = testUpperSevereSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('upperSevere');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(0);
  });

  it('should detect and grade an upper severe violation if there is also a warning', async () => {
    const test = testWarningSevereMix;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations.length).to.equal(2);
    expect(result.violations[0].breach).to.equal('upperWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);

    expect(result.violations[1].breach).to.equal('upperSevere');
    expect(result.violations[1].key).to.equal(test.results[2].key);
    expect(result.violations[1].value).to.equal(test.results[2].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(0);
  });

  it('should detect and grade lower warning on a single entity', async () => {
    const test = testLowerWarningeSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('lowerWarning');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(test.grading.metricScore / 2);
  });

  it('should detect and grade upper severe breach on a single entity', async () => {
    const test = testLowerSevereSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('lowerSevere');
    expect(result.violations[0].key).to.equal(test.results[0].key);
    expect(result.violations[0].value).to.equal(test.results[0].value);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
    expect(result.score).to.equal(0);
  });

  it('should detect two violations if upper and lower boundaries are contradictive', async () => {
    const test = testUpperLowerCollision;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations.length).to.equal(2);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
  });

  it('should report a violation if a single entity result is empty', async () => {
    const test = testEmptyResults;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations[0].breach).to.equal('The indicator returned no values');
    expect(result.score).to.equal(0);
    expect(result.violations[0].metadata.playbookhints)
      .to.equal(test.grading.metadata.playbookhints);
  });

  // tslint:disable-next-line: max-line-length
  it('should report no violation if a single entity result is empty and ignoreEmpty is true', async () => {
    const test = testIgnoreEmptyResults;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations).to.be.empty;
    expect(result.score).to.equal(test.grading.metricScore);
  });

  it('should detect and grade a single result with no violation', async () => {
    const test = testPassSingle;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations).to.be.empty;
    expect(result.score).to.equal(test.grading.metricScore);
  });

  it('should detect and grade multiple results with no violation', async () => {
    const test = testPassMultiple;
    const grader = new Grader();
    const result = grader.grade(test.id, test.results, test.grading);
    expect(result.violations).to.be.empty;
    expect(result.score).to.equal(test.grading.metricScore);
  });
});
