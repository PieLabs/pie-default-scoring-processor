export default class PieCustomScoringProcessor {

  constructor(config){
    this._config = config;
  }

  /**
   * Calculate custom score
   * @param pies [{id:'1', weight: 3, ...}, {id:'2', weight: 5, ...}]
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */
  score(item, sessions, outcomes) {
    throw new Error("Not implemented");
  }
}