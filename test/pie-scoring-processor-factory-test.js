import chai from 'chai';
chai.should();

import sinon from 'sinon';

import ScoringProcessorFactory from '../lib/pie-scoring-processor-factory';
import ScoringType from '../lib/pie-scoring-type';

import AllOrNothingScoringProcessor from '../lib/pie-all-or-nothing-scoring-processor';
import CustomScoringProcessor from '../lib/pie-custom-scoring-processor';
import WeightedScoringProcessor from '../lib/pie-weighted-scoring-processor';

describe('PieScoringProcessorFactoryTest', () => {

  let factory;

  beforeEach((done) => {
    factory = new ScoringProcessorFactory();
    done();
  });

  describe('getProcessor', () => {
    describe('scoringType=custom', () => {
      it('should return the custom scoring processor', () => {
        let processor = factory.getProcessor({
          scoringType: ScoringType.CUSTOM
        });
        processor.constructor.should.equal(CustomScoringProcessor);
      });
    });
    describe('scoringType=allOrNothing', () => {
      it('should return the allOrNothing scoring processor', () => {
        let processor = factory.getProcessor({
          scoringType: ScoringType.ALL_OR_NOTHING
        });
        processor.constructor.should.equal(AllOrNothingScoringProcessor);
      });
    });
    describe('default', () => {
      it('should return the weighted scoring processor', () => {
        let processor = factory.getProcessor({});
        processor.constructor.should.equal(WeightedScoringProcessor);
      });
    });
  });
});