import Ember from "ember";
import ENV from "../config/environment";


export default Ember.ObjectController.extend({
  selectedBackupType: "",
  selectedBackups: Ember.computed.filter('model.backups', function(i) {
    if (this.get('selectedBackupType')=="") return true;
    return i.get('pid')==this.get('selectedBackupType'); 
  }).property('model.backups', 'selectedBackupType'),
  actions: {
    backup: function(type) {
      $.ajax({
        url: ENV.APP.krakenHost+'/backups/'+type,
        type: 'POST'
      });
    },
    selectType: function(item) {
      $('.ui-navlist > li').removeClass('active');
      $('#'+item).addClass('active');
      this.set('selectedBackupType', item!="all"?item:"");
    }
  }
});