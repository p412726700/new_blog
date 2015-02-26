/**
 * Created by panew on 15-2-24.
 */

var http = require('http');
var Article = require('./../models/article');
exports.index = function (req, res) {
  console.log(req.body);
  var secret = '532e232e6c639993343c09668e45b621',
    short_name = 'panblog',
    url = 'http://api.duoshuo.com/log/list.json?short_name=' + short_name + '&secret=' + secret+'&limit=3&order=desc',
    data = '', item = '';

  http.get(url, function (res) {
    console.log("Got response: " + res.statusCode);
    res.on('data', function (results) {
      data =JSON.parse(results);
      console.log("Got data: " + data);
      item = data.response;
      item=item[0];
      if (item.action === "delete") {
        Article.find({comment_ids: {$in: item.meta}}, function (err, result) {
          if (err) {
            console.log('err', err);
          }
          else {
            console.log(result);
          }
        })
      }
      else if (item.action === 'create' && item.meta.status === 'approved') {
        Article.find({_id: item.meta.thread_key}).exec()
          .then(function (article) {
            console.log(article)
            console.log(typeof article.comment_ids)
            article.comment_ids.push(item.meta.post_id);
            article.save();
          })
          .then(null, function (err) {
            console.log(err);
          })
      }

    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });

  return res.json(200);
};