"use strict";

var BlogController = require('./controllers/blog');
var BloggerController = require('./controllers/blogger');
var RSS = require('rss');

exports.serveRoutes = function(router) {
    router.get('/main', function(req, res) {
        var mainFeed = new RSS({
            title: "Computer Science Blogs",
            description: "All of the posts from bloggers on CSBlogs.com",
            feed_url: "http://feeds.csblogs.com/main",
            site_url: "http://csblogs.com",
        });

        BlogController.getMostRecentBlogs({}, 20, function(blogs, error) {
            if (req.query.original !== 'true') {
                BlogController.removeAllHTML(blogs, 400);
            }
            for (var i = 0; i < blogs.length; ++i) {
                mainFeed.item({
                    title: 			blogs[i].title,
                    description: 	blogs[i].summary,
                    url: 			blogs[i].link,
                    guid: 			blogs[i]._id.toString(),
                    author: 		blogs[i].author.firstName + ' ' + blogs[i].author.lastName,
                    date: 			blogs[i].pubDate
                });
            }

            res.header('Content-Type','application/rss+xml');
            res.send(mainFeed.xml({indent: true}));
        });
    });
};