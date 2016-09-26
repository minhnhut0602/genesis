import DS from "ember-data";
import cardColor from "../utils/card-color";


export default DS.Model.extend({
    domain: DS.attr('string'),
    expiry: DS.attr('date'),
    keylength: DS.attr('number'),
    keytype: DS.attr('string'),
    md5: DS.attr('string'),
    sha1: DS.attr('string'),
    assigns: DS.attr(),
    isReady: DS.attr('boolean', {defaultValue: false}),
    certType: function() {
      return 'certificate';
    }.property(),
    isAuthority: function() {
      return this.get('certType') === 'authority';
    }.property('certType'),
    typeString: function() {
      return `${this.get('keylength')}-bit ${this.get('keytype')}`;
    }.property('keylength', 'keytype'),
    cardColor: function() {
      return cardColor();
    }.property()
});