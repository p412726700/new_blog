/**
 * Created by panew on 14-12-7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Article = new Schema({
  title      : {type: String},
  content    : {type: String},
  source     : {type: String},
  top        : {type: Boolean, default: false},
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date, default: Date.now},
  views      : {type: Number, default: 0},
  comment_ids: {type: Array, default: []},
  tags       : {type: Array, default: []},
  cat        : {type: Number}
}, {
  toJSON: {virtuals: true}
});

Article.virtual('comments').get(function () {
  return this.comment_ids ? this.comment_ids.length : 0;
});

Article.index({created_at: -1});

module.exports = mongoose.model('Article', Article);