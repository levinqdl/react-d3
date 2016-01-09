'use strict';

var React = require('react');

module.exports = {
  propTypes: {
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps:function() {
    return {
      xAccessor: function(d)  {return d.x;},
      yAccessor: function(d)  {return d.y;}
    };
  }
}
