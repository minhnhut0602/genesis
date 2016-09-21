import Ember from 'ember';

export default Ember.Controller.extend({
  breadCrumb: Ember.computed("model.name", {
    get() {
      return {name: this.get("model.name"), icon: 'fa-user'};
    }
  }),
  actions: {
    save: function(){
      var self = this;
      var user = this.get('model');
      user.set('isReady', false);
      var promise = user.save();
      promise.then(function(){}, function(e){
        if (e.status === 500) {
          self.transitionToRoute("error", e);
        }
      });
    },
    openModal: function(name) {
      Ember.$('.ui.' + name + '.modal').modal('show');
    },
    deleteUser: function() {
      var self = this;
      this.get('model').destroyRecord();
      Ember.$('.ui.delete-user.modal').modal('hide', function() {
        self.transitionToRoute('roles.users');
      });
    }
  }
});
