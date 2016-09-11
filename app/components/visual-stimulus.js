import Ember from 'ember';
import VisualStimulusGenerator from 'genocog/utils/visual-stimulus-generator';
import Staircase from 'genocog/utils/staircase';

export default Ember.Component.extend({
  stair: null,
  staircase: null,

  tagName: 'div',
  classNames: ['visual-stimulus'],

  init() {
    this._super(...arguments);
    this.set('staircase', new Staircase());
  },

  actions: {
    next() {
      this.get('staircase').runTrial().then((currentStair) => {
        this.set('stair', currentStair);

        let stimulus = new VisualStimulusGenerator();
        let canvas1 = stimulus.generateImage(currentStair.stimulusVal),
            canvas2 = stimulus.generateImage(currentStair.stimulusVal, true);
        Ember.$('canvas', this.element).remove();
        Ember.$(this.element).append(canvas1);
        Ember.$(this.element).append(canvas2);
      });
    }
  }
});
