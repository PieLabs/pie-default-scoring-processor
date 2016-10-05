'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pieScoringType = require('./pie-scoring-type');

var _pieScoringType2 = _interopRequireDefault(_pieScoringType);

var _pieAllOrNothingScoringProcessor = require('./pie-all-or-nothing-scoring-processor');

var _pieAllOrNothingScoringProcessor2 = _interopRequireDefault(_pieAllOrNothingScoringProcessor);

var _pieCustomScoringProcessor = require('./pie-custom-scoring-processor');

var _pieCustomScoringProcessor2 = _interopRequireDefault(_pieCustomScoringProcessor);

var _pieWeightedScoringProcessor = require('./pie-weighted-scoring-processor');

var _pieWeightedScoringProcessor2 = _interopRequireDefault(_pieWeightedScoringProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PieScoringProcessorFactory = function () {
  function PieScoringProcessorFactory() {
    _classCallCheck(this, PieScoringProcessorFactory);

    this._processors = [];
    this._addDefaultProcessors();
  }

  _createClass(PieScoringProcessorFactory, [{
    key: 'getProcessor',
    value: function getProcessor(config) {
      var foundItem = this._processors.find(function (p) {
        return p.test(config);
      });
      return new foundItem.processorDefinition(config);
    }
  }, {
    key: 'addProcessor',
    value: function addProcessor(test, processorDefinition) {
      //Note: processors are added using unshift
      //A processor, that is added later, can override the existing ones,
      //if the test for it returns true
      this._processors.unshift({ test: test, processorDefinition: processorDefinition });
    }
  }, {
    key: '_addDefaultProcessors',
    value: function _addDefaultProcessors() {
      this.addProcessor(this._isDefault, _pieWeightedScoringProcessor2.default);
      this.addProcessor(this._isAllOrNothing, _pieAllOrNothingScoringProcessor2.default);
      this.addProcessor(this._isCustom, _pieCustomScoringProcessor2.default);
    }
  }, {
    key: '_isDefault',
    value: function _isDefault(config) {
      return true;
    }
  }, {
    key: '_isAllOrNothing',
    value: function _isAllOrNothing(config) {
      return config.scoringType === _pieScoringType2.default.ALL_OR_NOTHING;
    }
  }, {
    key: '_isCustom',
    value: function _isCustom(config) {
      return config.scoringType === _pieScoringType2.default.CUSTOM;
    }
  }]);

  return PieScoringProcessorFactory;
}();

exports.default = PieScoringProcessorFactory;