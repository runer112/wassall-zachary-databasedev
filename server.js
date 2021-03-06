var app = require('./express');
var express = app.express;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "fusyd8s0dg" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

require("./database");
require("./project/app")(app);

app.listen(process.env.PORT || 3000);
