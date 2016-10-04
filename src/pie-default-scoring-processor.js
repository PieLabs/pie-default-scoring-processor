import ScoringType from "./pie-scoring-type"

/**
 * This is a reimplementation of the container scoring processor
 * with one important difference: We are not using controller.isScoreable
 * but checking the outcome for a component to find out whether it is
 * scoreable or not
 */
export default class PieDefaultScoringProcessor {

  /**
   * Calculate the weighted or allOrNothing score
   * @param item {scoringType: 'weighted', components:[{id:'1', weight: 3, ...}, {id:'2', weight: 5, ...}]}
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */
  score(item, sessions, outcomes) {
    const scoringType = this._getScoringType(item);
    const scoreableComponents = this._getScoreableComponents(item, sessions, outcomes);
    const weights = this._getWeights(scoreableComponents);
    const componentScores = this._getComponentScores(scoreableComponents, weights, outcomes);
    const maxPoints = this._sumOfWeights(weights);
    const points = this._sumOfWeightedScores(componentScores);
    const summary = this._makeSummary(scoringType, maxPoints, points);
    return {
      summary,
      "components": componentScores
    }
  }

  _isComponentScoreable(compJson, compSession, compOutcome) {
    return compOutcome && compOutcome.hasOwnProperty('score');
  }

  _getScoringType(item, defaultScoringType) {
    let scoringType = null;
    if (item && item.scoringType) {
      scoringType = item.scoringType;
    }
    if(ScoringType.isValidValue(scoringType)){
      return scoringType
    }
    return ScoringType.WEIGHTED;
  }

  _getScoreableComponents(item, sessions, outcomes) {
    const results = {};
    for (let i = 0; i < item.pies.length; i++) {
      const compJson = item.pies[i];
      const compId = compJson.id;
      const compSession = this._findById(sessions, compId, {});
      const compOutcome = this._findById(outcomes, compId, {});
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
    const results = [];
    for (let id in scoreableComponents) {
      const weight = weights[id];
      const score = this._findById(outcomes, id, {}).score.scaled || 0;
      const weightedScore = weight * score;
      results.push({
        id,
        weight,
        score,
        weightedScore
      });
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
      maxPoints,
      points,
      percentage
    };
  }

  _findById(col, id, defaultValue = null){
    for(let i=0; i<col.length; i++){
      if(col[i].id === id){
        return col[i];
      }
    }
    return defaultValue;
  }
}