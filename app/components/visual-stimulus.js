import Ember from 'ember';
import Stimulus from 'genocog-canvas';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['visual-stimulus'],
  didInsertElement() {
    let stimulus = new Stimulus();
    let canvas = stimulus.generateImage(0.5);
    this.$.append(canvas);
  }
});
