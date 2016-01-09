'use strict';

var React = require('react');

module.exports = React.createClass({displayName: "exports",

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps:function() {
    return {
      offset: 0,
      className: 'rd3-barchart-bar'
    };
  },

  render:function() {
    return (
      React.createElement("g", null, 
        React.createElement("text", {x: this.props.x+this.props.width/2, y: this.props.y-5, fontSize: "20", textAnchor: "middle", alignmentBaseline: "middle"}, this.props.value), 
        React.createElement("rect", React.__spread({
          className: "rd3-barchart-bar"}, 
          this.props, 
          {fill: this.props.fill, 
          onMouseOver: this.props.handleMouseOver, 
          onMouseLeave: this.props.handleMouseLeave})
        )
      )
    );
  }
});
