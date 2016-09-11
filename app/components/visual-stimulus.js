import Ember from 'ember';
import VisualStimulusGenerator from 'genocog/utils/visual-stimulus-generator';

export default Ember.Component.extend({
  contrast: null,
  withGabor: null,

  tagName: 'div',
  classNames: ['visual-stimulus'],
  didInsertElement() {
    let stimulus = new VisualStimulusGenerator();
    let canvas1 = stimulus.generateImage(this.get('contrast')),
        canvas2 = stimulus.generateImage(this.get('contrast'), true);
    Ember.$(this.element).append(canvas1);
    Ember.$(this.element).append(canvas2);
  }
});
