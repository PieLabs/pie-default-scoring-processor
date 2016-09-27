//is using the components controller isScoreable method
//to find out if the component should be scored
//i wonder if we can use the outcomes instead?
//no outcome -> is not scoreable

import ScoringType from "./pie-scoring-type"

export default class PieDefaultScoringProcessor {

  constructor(clientSideController){
    this._clientSideController = clientSideController;
  }

  score(item, sessions, outcomes) {
    const scoringType = this._getScoringType(item);
    const scoreableComponents = this._getScoreableComponents(item, sessions, outcomes);
    const weights = this._getWeights(scoreableComponents);
    const componentScores = this._getComponentScores(scoreableComponents, weights, outcomes);
    const maxPoints = this._sumOfWeights(weights);
    const points = this._sumOfWeightedScores(componentScores);
    const summary = this._makeSummary(scoringType, maxPoints, points);
    return {
      "summary": summary,
      "components": componentScores
    }
  }

  _isComponentScoreable(compJson, compSession, compOutcome) {
    return this._clientSideController.isScoreable(compJson, compSession, compOutcome);
  }

  _getScoringType(item, defaultScoringType) {
    var scoringType = null;
    if (item && item.config && item.config.scoringType) {
      scoringType = item.config.scoringType;
    }
    switch (scoringType) {
      case ScoringType.WEIGHTED:
      case ScoringType.ALL_OR_NOTHING:
        return scoringType;
      default:
        return ScoringType.WEIGHTED;
    }
  }

  _getScoreableComponents(item, sessions, outcomes) {
    var results = {};
    for (var i = 0; i < item.components.length; i++) {
      let compJson = item.components[i];
      let compId = compJson.id;
      let compSession = sessions.components[compId] || {};
      let compOutcome = outcomes.components[compId] || {};
      if (this._isComponentScoreable(compJson, compSession, compOutcome)) {
        results[compId] = compJson;
      }
    }
    return results;
  }

  _getWeights(scoreableComponents) {
    var results = {};
    for (var id in scoreableComponents) {
      results[id] = scoreableComponents[id].weight || 1;
    }
    return results;
  }

  _getComponentScores(scoreableComponents, weights, outcomes) {
    var results = {};
    for (var id in scoreableComponents) {
      var weight = weights[id];
      var score = outcomes[id].score || 0;
      var weightedScore = weight * score;
      results[id] = {
        weight: weight,
        score: score,
        weightedScore: weightedScore
      };
    }
    return results;
  }

  _sumOfWeights(weights){
    var result = 0;
    for (var id in weights) {
      result += weights[id];
    }
    return result;
  }

  _sumOfWeightedScores(componentScores){
    var result = 0;
    for (var id in componentScores) {
      result += componentScores[id].weightedScore;
    }
    return result;
  }

  _makeSummary(scoringType, maxPoints, points){
    let percentage;
    if(scoringType === ScoringType.ALL_OR_NOTHING){
      if(points < maxPoints) {
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
      "maxPoints" : maxPoints,
      "points" : points,
      "percentage" : percentage
    };
  }
}