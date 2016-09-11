import Ember from 'ember';

export default Ember.Route.extend({
  cookies: Ember.inject.service(),

  checkFor23andmeCookie: Ember.on('activate', function() {
    let cookies = this.get('cookies');

    if (cookies.read('23andme') === 'connected') {
      this.transitionTo('profile');
    }
  })
});
