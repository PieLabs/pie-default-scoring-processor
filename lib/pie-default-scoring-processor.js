"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pieScoringType = require("./pie-scoring-type");

var _pieScoringType2 = _interopRequireDefault(_pieScoringType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is a reimplementation of the container scoring processor
 * with one important difference: We are not using controller.isScoreable
 * but checking the outcome for a component to find out whether it is
 * scoreable or not
 */
var PieDefaultScoringProcessor = function () {
  function PieDefaultScoringProcessor() {
    _classCallCheck(this, PieDefaultScoringProcessor);
  }

  _createClass(PieDefaultScoringProcessor, [{
    key: "score",


    /**
     * Calculate the weighted or allOrNothing score
     * @param item {scoringType: 'weighted', components:[{id:'1', weight: 3, ...}, {id:'2', weight: 5, ...}]}
     * @param sessions [{id: '1', ...}, {id: '2', ...}]
     * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
     * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
     */
    value: function score(item, sessions, outcomes) {
      var scoringType = this._getScoringType(item);
      var scoreableComponents = this._getScoreableComponents(item, sessions, outcomes);
      var weights = this._getWeights(scoreableComponents);
      var componentScores = this._getComponentScores(scoreableComponents, weights, outcomes);
      var maxPoints = this._sumOfWeights(weights);
      var points = this._sumOfWeightedScores(componentScores);
      var summary = this._makeSummary(scoringType, maxPoints, points);
      return {
        summary: summary,
        "components": componentScores
      };
    }
  }, {
    key: "_isComponentScoreable",
    value: function _isComponentScoreable(compJson, compSession, compOutcome) {
      return compOutcome && compOutcome.hasOwnProperty('score');
    }
  }, {
    key: "_getScoringType",
    value: function _getScoringType(item, defaultScoringType) {
      var scoringType = null;
      if (item && item.scoringType) {
        scoringType = item.scoringType;
      }
      if (_pieScoringType2.default.isValidValue(scoringType)) {
        return scoringType;
      }
      return _pieScoringType2.default.WEIGHTED;
    }
  }, {
    key: "_getScoreableComponents",
    value: function _getScoreableComponents(item, sessions, outcomes) {
      var results = {};
      for (var i = 0; i < item.pies.length; i++) {
        var compJson = item.pies[i];
        var compId = compJson.id;
        var compSession = this._findById(sessions, compId, {});
        var compOutcome = this._findById(outcomes, compId, {});
        if (this._isComponentScoreable(compJson, compSession, compOutcome)) {
          results[compId] = compJson;
        }
      }
      return results;
    }
  }, {
    key: "_getWeights",
    value: function _getWeights(scoreableComponents) {
      var results = {};
      for (var id in scoreableComponents) {
        results[id] = scoreableComponents[id].weight || 1;
      }
      return results;
    }
  }, {
    key: "_getComponentScores",
    value: function _getComponentScores(scoreableComponents, weights, outcomes) {
      var results = {};
      for (var id in scoreableComponents) {
        var weight = weights[id];
        var score = this._findById(outcomes, id, {}).score.scaled || 0;
        var weightedScore = weight * score;
        results[id] = {
          weight: weight,
          score: score,
          weightedScore: weightedScore
        };
      }
      return results;
    }
  }, {
    key: "_sumOfWeights",
    value: function _sumOfWeights(weights) {
      var result = 0;
      for (var id in weights) {
        result += weights[id];
      }
      return result;
    }
  }, {
    key: "_sumOfWeightedScores",
    value: function _sumOfWeightedScores(componentScores) {
      var result = 0;
      for (var id in componentScores) {
        result += componentScores[id].weightedScore;
      }
      return result;
    }
  }, {
    key: "_makeSummary",
    value: function _makeSummary(scoringType, maxPoints, points) {
      var percentage = void 0;
      if (scoringType === _pieScoringType2.default.ALL_OR_NOTHING) {
        if (points < maxPoints) {
          points = 0;
          percentage = 0;
        } else {
          points = maxPoints;
          percentage = 100.0;
        }
      } else {
        percentage = Math.round(points * 1000 / maxPoints) / 10;
      }
      return {
        maxPoints: maxPoints,
        points: points,
        percentage: percentage
      };
    }
  }, {
    key: "_findById",
    value: function _findById(col, id) {
      var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      for (var i = 0; i < col.length; i++) {
        if (col[i].id === id) {
          return col[i];
        }
      }
      return defaultValue;
    }
  }]);

  return PieDefaultScoringProcessor;
}();

exports.default = PieDefaultScoringProcessor;