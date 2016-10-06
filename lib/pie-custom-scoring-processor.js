"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PieCustomScoringProcessor = function () {
  function PieCustomScoringProcessor(config) {
    _classCallCheck(this, PieCustomScoringProcessor);

    this._config = config;
  }

  /**
   * Calculate custom score
   * @param pies [{id:'1', weight: 3, ...}, {id:'2', weight: 5, ...}]
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */


  _createClass(PieCustomScoringProcessor, [{
    key: "score",
    value: function score(item, sessions, outcomes) {
      throw new Error("Not implemented");
    }
  }]);

  return PieCustomScoringProcessor;
}();

exports.default = PieCustomScoringProcessor;