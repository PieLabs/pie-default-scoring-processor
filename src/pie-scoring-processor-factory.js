import ScoringType from './pie-scoring-type';
import PieAllOrNothingScoringProcessor from './pie-all-or-nothing-scoring-processor';
import PieCustomScoringProcessor from './pie-custom-scoring-processor';
import PieWeightedScoringProcessor from './pie-weighted-scoring-processor';

export default class PieScoringProcessorFactory {

  constructor(){
    this._processors = [];
    this._addDefaultProcessors();
  }

  getProcessor(config){
    let foundItem = this._processors.find(function(p){
      return p.test(config);
    });
    return new foundItem.processorDefinition(config);
  }

  addProcessor(test, processorDefinition){
    //Note: processors are added using unshift
    //A processor, that is added later, can override the existing ones,
    //if the test for it returns true
    this._processors.unshift({test, processorDefinition});
  }

  _addDefaultProcessors(){
    this.addProcessor(this._isDefault, PieWeightedScoringProcessor);
    this.addProcessor(this._isAllOrNothing, PieAllOrNothingScoringProcessor);
    this.addProcessor(this._isCustom, PieCustomScoringProcessor);
  }

  _isDefault(config){
    return true;
  }

  _isAllOrNothing(config){
    return config.scoringType === ScoringType.ALL_OR_NOTHING;
  }

  _isCustom(config){
    return config.scoringType === ScoringType.CUSTOM;
  }

}

