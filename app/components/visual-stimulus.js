import Ember from 'ember';
import VisualStimulusGenerator from 'genocog/utils/visual-stimulus-generator';

export default Ember.Component.extend({
  contrast: null,
  withGabor: null,

  tagName: 'div',
  classNames: ['visual-stimulus'],
  didInsertElement() {
    let stimulus = new VisualStimulusGenerator();
    let canvas = stimulus.generateImage(this.get('contrast'));
    Ember.$(this.element).append(canvas);
  }
});
