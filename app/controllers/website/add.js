import Ember from "ember";


export default Ember.ObjectController.extend({
  step: 1,
  last: 2,
  newSite: {port: 80, extraData: {}},
  validateFields: [2],
  sortBy: ['name'],
  sortedApps: Ember.computed.sort('model.apps', 'sortBy'),
  isLarge: function() {
    return this.get('step')==1;
  }.property('step'),
  pageTitle: function() {
    if (this.get('step')==1) {
      return "Step 1: Choose a Website Type";
    } else {
      return "Step 2: General Settings";
    };
  }.property('step'),
  canNext: function() {
    return this.get('selectedSite')!=null;
  }.property('selectedSite'),
  canComplete: function() {
    return this.get('selectedSite')!=null;
  }.property('selectedSite'),
  actions: {
    selectType: function(item) {
      $('.ui-navlist > li').removeClass('active');
      $('#'+item.id).addClass('active');
      this.set('selectedSite', item);
    },
    save: function() {
      var site = this.store.createRecord('website', {
        id: this.get('newSite').name,
        siteType: this.get('selectedSite').get('id'),
        siteName: this.get('selectedSite').get('name'),
        siteIcon: this.get('selectedSite').get('icon'),
        addr: this.get('newSite').address,
        port: this.get('newSite').port,
        extraData: this.get('newSite').extraData
      });
      site.save();
    },
    removeModal: function() {
      this.set('selectedSite', null);
      this.set('newSite', {port: 80, extraData: {}});
      this.set('step', 1);
      return true;
    }
  }
});