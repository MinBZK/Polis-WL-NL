// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var template = require("../templates/writingTips.handlebars");
var Handlebones = require("handlebones");
var config = require("../../polis.config");

module.exports = Handlebones.View.extend({
  name: "writingTips",
  template: template,
  context: function() {
    return { privacyUrl: config.PRIVACY_URL }
  }
});
