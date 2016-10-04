import chai from 'chai';
chai.should();

import sinon from 'sinon';

import ScoringProcessor from '../lib/pie-default-scoring-processor';
import ScoringType from '../lib/pie-scoring-type';

describe('PieDefaultScoringProcessor', () => {

  let processor;

  beforeEach((done) => {
    processor = new ScoringProcessor();
    done();
  });

  describe('score', () => {
    it('should calculate the score for all components with outcome', () => {
      const item = {
        'pies': [
          {
            'id': '1'
          },
          {
            'id': '2'
          }
        ]
      }
      const sessions = [
        {
          'id': '1'
        }
      ]
      const outcomes = [
        {
          'id': '1',
          'score': {
            'scaled': 1
          }
        }
      ]
      let result = processor.score(item, sessions, outcomes);
      result.summary.should.eql({
        maxPoints: 1,
        percentage: 100,
        points: 1
      });
    });
  });

  describe('_getScoringType', () => {
    it('should return WEIGHTED when no scoring type is defined', () => {
      const scoringType = processor._getScoringType({});
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return WEIGHTED when scoring type is invalid', () => {
      const scoringType = processor._getScoringType({
        'scoringType': 'invalid scoring type'
      });
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return WEIGHTED when scoring type is WEIGHTED', () => {
      const scoringType = processor._getScoringType({
        'scoringType': ScoringType.WEIGHTED
      });
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return ALL_OR_NOTHING when scoring type is ALL_OR_NOTHING', () => {
      const scoringType = processor._getScoringType({
        'scoringType': ScoringType.ALL_OR_NOTHING
      });
      scoringType.should.eql(ScoringType.ALL_OR_NOTHING);
    });
  });

  describe('_getScoreableComponents', () => {
    it('should return all components which we have an outcome for', () => {
      const item = {
        'pies': [
          {
            'id': '1'
          },
          {
            'id': '2'
          }
        ]
      }
      const sessions = [
        {
          'id': '1'
        }
      ]
      const outcomes = [
        {
          'id': '1',
          'score': {
            'scaled': 1
          }
        }
      ]
      const scoreableComponents = processor._getScoreableComponents(item, sessions, outcomes);
      scoreableComponents.should.eql({
        '1': {
          'id': '1'
        }
      });
    });
  });

  describe('_getWeights', () => {
    it('should return the weights of the components', () => {
      const scoreableComponents = {
        '1': {
          'weight': 1
        },
        '2': {
          'weight': 2
        },
        '3': {
          'weight': 3
        }
      }
      const weights = processor._getWeights(scoreableComponents);
      weights.should.eql({
        '1': 1,
        '2': 2,
        '3': 3
      });
    });
    it('should return 1 as the default weight', () => {
      const scoreableComponents = {
        'componentWithoutWeight': {}
      }
      const weights = processor._getWeights(scoreableComponents);
      weights.should.eql({
        'componentWithoutWeight': 1
      });
    });
  });

  describe('_getComponentScores', () => {
    it('should returns weighted scores as product of score and weight', () => {
      const scoreableComponents = {
        '1': {},
        '2': {},
        '3': {}
      }
      const weights = {
        '1': 1,
        '2': 2,
        '3': 3
      }
      const outcomes = [
        {
          'id': '1',
          'score': {
            'scaled': 1
          }
        },
        {
          'id': '2',
          'score': {
            'scaled': 2
          }
        },
        {
          'id': '3',
          'score': {
            'scaled': 3
          }
        }
        ]
      const componentScores = processor._getComponentScores(scoreableComponents, weights, outcomes);
      componentScores.should.eql({
        '1': {
          'score': 1,
          'weight': 1,
          'weightedScore': 1
        },
        '2': {
          'score': 2,
          'weight': 2,
          'weightedScore': 4
        },
        '3': {
          'score': 3,
          'weight': 3,
          'weightedScore': 9
        }
      });
    });
  });

  describe('_sumOfWeights', () => {
    it('should return 6', () => {
      const weights = {
        '1': 1,
        '2': 2,
        '3': 3
      };
      const sum = processor._sumOfWeights(weights);
      sum.should.eql(6);
    });
  });

  describe('_sumOfWeightedScores', () => {

    it('should return 6', () => {
      const componentScores = {
        '1': {
          'weightedScore': 1
        },
        '2': {
          'weightedScore': 2
        },
        '3': {
          'weightedScore': 3
        }
      };

      const sum = processor._sumOfWeightedScores(componentScores);
      sum.should.eql(6);
    });
  });

  describe('_makeSummary', () => {
    describe('scoringType=allOrNothing', () => {
      it('should return all, when points == maxPoints', () => {
        const summary = processor._makeSummary(ScoringType.ALL_OR_NOTHING, 7, 7);
        summary.should.eql({
          maxPoints: 7,
          points: 7,
          percentage: 100
        });
      });
      it('should return nothing, when points < maxPoints', () => {
        const summary = processor._makeSummary(ScoringType.ALL_OR_NOTHING, 7, 6);
        summary.should.eql({
          maxPoints: 7,
          points: 0,
          percentage: 0
        });
      });
    });
    describe('scoringType=weighted', () => {
      it('should return actual points', () => {
        const summary = processor._makeSummary(ScoringType.WEIGHTED, 100, 71);
        summary.should.eql({
          maxPoints: 100,
          points: 71,
          percentage: 71.0
        });
      });
    });
  });
});