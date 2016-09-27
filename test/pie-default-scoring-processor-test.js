import chai from 'chai';
chai.should();

import sinon from 'sinon';

import ScoringProcessor from '../src/pie-default-scoring-processor';
import ScoringType from '../src/pie-scoring-type';

describe('PieDefaultScoringProcessor', () => {

  let processor;

  beforeEach((done) => {
    processor = new ScoringProcessor();
    done();
  });

  describe('_getScoringType', () => {
    it('should return WEIGHTED when no scoring type is defined', () => {
      let scoringType = processor._getScoringType({});
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return WEIGHTED when scoring type is invalid', () => {
      let scoringType = processor._getScoringType({
        'config': {
          'scoringType': 'invalid scoring type'
        }
      });
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return WEIGHTED when scoring type is WEIGHTED', () => {
      let scoringType = processor._getScoringType({
        'config': {
          'scoringType': ScoringType.WEIGHTED
        }
      });
      scoringType.should.eql(ScoringType.WEIGHTED);
    });
    it('should return ALL_OR_NOTHING when scoring type is ALL_OR_NOTHING', () => {
      let scoringType = processor._getScoringType({
        'config': {
          'scoringType': ScoringType.ALL_OR_NOTHING
        }
      });
      scoringType.should.eql(ScoringType.ALL_OR_NOTHING);
    });
  });

  describe('_getScoreableComponents', () => {
    it('should return all components which we have an outcome for', () => {
      let item = {
        'components': [
          {
            'id': '1'
          },
          {
            'id': '2'
          }
        ]
      }
      let sessions = {
        'components': {}
      }
      let outcomes = {
        'components': {
          '1' : {
            'score' : 1
          }
        }
      }
      let scoreableComponents = processor._getScoreableComponents(item, sessions, outcomes);
      scoreableComponents.should.eql({
        '1': {
          'id': '1'
        }
      });
    });
  });

  describe('_getWeights', () => {
    it('should return the weights of the components', () => {
      let scoreableComponents = {
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
      let weights = processor._getWeights(scoreableComponents);
      weights.should.eql({
        '1': 1,
        '2': 2,
        '3': 3
      });
    });
    it('should return 1 as the default weight', () => {
      let scoreableComponents = {
        'componentWithoutWeight': {}
      }
      let weights = processor._getWeights(scoreableComponents);
      weights.should.eql({
        'componentWithoutWeight': 1
      });
    });
  });

  describe('_getComponentScores', () => {
    it('should returns weighted scores as product of score and weight', () => {
      let scoreableComponents = {
        '1': {},
        '2': {},
        '3': {}
      }
      let weights = {
        '1': 1,
        '2': 2,
        '3': 3
      }
      let outcomes = {
        '1': {
          score: 1
        },
        '2': {
          score: 2
        },
        '3': {
          score: 3
        }
      }
      let componentScores = processor._getComponentScores(scoreableComponents, weights, outcomes);
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
      let weights = {
        '1': 1,
        '2': 2,
        '3': 3
      };
      let sum = processor._sumOfWeights(weights);
      sum.should.eql(6);
    });
  });

  describe('_sumOfWeightedScores', () => {

    it('should return 6', () => {
      let componentScores = {
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

      let sum = processor._sumOfWeightedScores(componentScores);
      sum.should.eql(6);
    });
  });

  describe('_makeSummary', () => {
    describe('scoringType=allOrNothing', () => {
      it('should return all, when points == maxPoints', () => {
        let summary = processor._makeSummary(ScoringType.ALL_OR_NOTHING, 7, 7);
        summary.should.eql({
          maxPoints: 7,
          points: 7,
          percentage: 100
        });
      });
      it('should return nothing, when points < maxPoints', () => {
        let summary = processor._makeSummary(ScoringType.ALL_OR_NOTHING, 7, 6);
        summary.should.eql({
          maxPoints: 7,
          points: 0,
          percentage: 0
        });
      });
    });
    describe('scoringType=weighted', () => {
      it('should return actual points', () => {
        let summary = processor._makeSummary(ScoringType.WEIGHTED, 100, 71);
        summary.should.eql({
          maxPoints: 100,
          points: 71,
          percentage: 71.0
        });
      });
    });
  });
});