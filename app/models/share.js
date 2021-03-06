import DS from "ember-data";
import cardColor from "../utils/card-color";


export default DS.Model.extend({
  shareType: DS.belongsTo('share-type', {async: true}),
  comment: DS.attr('string'),
  path: DS.attr('string'),
  validUsers: DS.attr(),
  public: DS.attr('boolean'),
  readOnly: DS.attr('boolean'),
  isReady: DS.attr('boolean'),
  cardColor: function() {
    return cardColor();
  }.property()
});
