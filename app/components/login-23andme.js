import Ember from 'ember';
import ENV from 'genocog/config/environment';

export default Ember.Component.extend({
  classNames: ['login-23andme', 'component'],

  scopes: null,

  scopesAsArray: Ember.computed('scopes', function() {
    return this.get('scopes').split(',');
  }),

  isRedirecting: false,

  integrateWithTtam: Ember.on('didInsertElement', function() {
    if (window.TTAM) {
      let ttam = window.TTAM(ENV.APP.login23andme.clientId),
          that = this;

      ttam.connectButton(this.get('elementId'), this.get('scopesAsArray'));

      window.onbeforeunload = function() {
        that.send('showRedirecting');
      };
    } else {
      throw new Error('Warning: 23andme TTAM not loaded. Cannot run app.');
    }
  }),

  actions: {
    showRedirecting: function() {
      let elementId = this.get('elementId'),
          iframeSelector = `#${elementId}.login-23andme iframe`;

      Ember.$(iframeSelector).hide();
      this.set('isRedirecting', true);
    }
  }
});
