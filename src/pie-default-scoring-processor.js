import ScoringType from "./pie-scoring-type"

/**
 * This is a reimplementation of the container scoring processor
 * with one important difference: We are not using controller.isScoreable
 * but checking the outcome for a component to find out whether it is
 * scoreable or not
 */
export default class PieDefaultScoringProcessor {

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
    return compOutcome && compOutcome.score !== undefined;
  }

  _getScoringType(item, defaultScoringType) {
    let scoringType = null;
    if (item && item.config && item.config.scoringType) {
      scoringType = item.config.scoringType;
    }
    if(ScoringType.isValidValue(scoringType)){
      return scoringType
    }
    return ScoringType.WEIGHTED;
  }

  _getScoreableComponents(item, sessions, outcomes) {
    const results = {};
    for (let i = 0; i < item.components.length; i++) {
      const compJson = item.components[i];
      const compId = compJson.id;
      const compSession = sessions.components[compId] || {};
      const compOutcome = outcomes.components[compId] || {};
      if (this._isComponentScoreable(compJson, compSession, compOutcome)) {
        results[compId] = compJson;
      }
    }
    return results;
  }

  _getWeights(scoreableComponents) {
    const results = {};
    for (let id in scoreableComponents) {
      results[id] = scoreableComponents[id].weight || 1;
    }
    return results;
  }

  _getComponentScores(scoreableComponents, weights, outcomes) {
    const results = {};
    for (let id in scoreableComponents) {
      const weight = weights[id];
      const score = outcomes[id].score || 0;
      const weightedScore = weight * score;
      results[id] = {
        weight: weight,
        score: score,
        weightedScore: weightedScore
      };
    }
    return results;
  }

  _sumOfWeights(weights){
    let result = 0;
    for (let id in weights) {
      result += weights[id];
    }
    return result;
  }

  _sumOfWeightedScores(componentScores){
    let result = 0;
    for (let id in componentScores) {
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