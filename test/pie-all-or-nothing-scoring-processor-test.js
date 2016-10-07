import chai from 'chai';
chai.should();

import sinon from 'sinon';

import ScoringProcessor from '../lib/pie-all-or-nothing-scoring-processor';
import ScoringType from '../lib/pie-scoring-type';

describe('PieAllOrNothingScoringProcessor', () => {

  let processor;

  beforeEach((done) => {
    processor = new ScoringProcessor();
    done();
  });

  describe('score', () => {
    it('should calculate the score for all components with outcome', () => {
      const pies = [
        {
          'id': '1'
        },
        {
          'id': '2'
        }
      ]

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
      let result = processor.score(pies, sessions, outcomes);
      result.should.eql({
        components: [
          {
            "id": "1",
            "score": 1
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
      const pies = [{
        'id': '1'
      }, {
        'id': '2'
      }]

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
      const scoreableComponents = processor._getScoreableComponents(pies, sessions, outcomes);
      scoreableComponents.should.eql({
        '1': {
          'id': '1'
        }
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
            'scaled': 1
          }
        },
        {
          'id': '3',
          'score': {
            'scaled': 1
          }
        }
      ]
      const componentScores = processor._getComponentScores(scoreableComponents, outcomes);
      componentScores.should.eql([
        {
          'id': '1',
          'score': 1
        },
        {
          'id': '2',
          'score': 1
        },
        {
          'id': '3',
          'score': 1
        }
      ]);
    });
  });

  describe('_numberOfScoreableComponents', () => {
    it('should return 3', () => {
      const scoreableComponents = {
        '1': {},
        '2': {},
        '3': {}
      }
      processor._numberOfScoreableComponents(scoreableComponents).should.eql(3);
    });
  });

  describe('_numberOfCorrectAnswers', () => {
    it('should return 2', () => {
      const componentScores = [
        {
          'id': '1',
          'score': 1
        },
        {
          'id': '2',
          'score': 1
        },
        {
          'id': '3',
          'score': 0
        }
      ];
      processor._numberOfCorrectAnswers(componentScores).should.eql(2);
    });
  });

  describe('_makeSummary', () => {
    it('should return 100%, when points == maxPoints', () => {
      const summary = processor._makeSummary(7, 7);
      summary.should.eql({
        maxPoints: 7,
        points: 7,
        percentage: 100
      });
    });
    it('should return 0%, when points < maxPoints', () => {
      const summary = processor._makeSummary(7, 6);
      summary.should.eql({
        maxPoints: 7,
        points: 0,
        percentage: 0
      });
    });
  });
});