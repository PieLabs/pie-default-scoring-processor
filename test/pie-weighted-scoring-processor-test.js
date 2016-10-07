import chai from 'chai';
chai.should();

import sinon from 'sinon';

import ScoringProcessor from '../lib/pie-weighted-scoring-processor';
import ScoringType from '../lib/pie-scoring-type';

describe('PieWeightedScoringProcessor', () => {

  let processor;

  beforeEach((done) => {
    processor = new ScoringProcessor({
      pies:[{id:"1"},{id:"2"},{id:"3"}],
      weights:[{id:"1", weight: 1},{id:"2", weight: 2},{id:"3", weight: 3}]
    });
    done();
  });

  describe('score', () => {
    it('should calculate the score for all components with outcome', () => {
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
      let result = processor.score(sessions, outcomes);
      result.should.eql({
        components: [
          {
            "id": "1",
            "score": 1,
            "weight": 1,
            "weightedScore": 1,
          }
        ],
        summary: {
          maxPoints: 1,
          percentage: 100,
          points: 1
        }
      });
    });
  });

  describe('_getScoreableComponents', () => {
    it('should return all components which we have an outcome for', () => {
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
      const scoreableComponents = processor._getScoreableComponents(sessions, outcomes);
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
        },
        '2': {
        },
        '3': {
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
      componentScores.should.eql([
        {
          'id': '1',
          'score': 1,
          'weight': 1,
          'weightedScore': 1
        },
        {
          'id': '2',
          'score': 2,
          'weight': 2,
          'weightedScore': 4
        },
        {
          'id': '3',
          'score': 3,
          'weight': 3,
          'weightedScore': 9
        }
      ]);
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
    it('should return actual points', () => {
      const summary = processor._makeSummary(100, 71);
      summary.should.eql({
        maxPoints: 100,
        points: 71,
        percentage: 71.0
      });
    });
  });
});