'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VornoiCircleContainer',

  getDefaultProps:function() {
    return { 
      circleRadius: 3,
      circleFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState:function() {
    return { 
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    };
  },

  render:function() {

    var props = this.props;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(props.hoverAnimation) {
      handleMouseOver = this._animateCircle;
      handleMouseLeave = this._restoreCircle;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }
    handleMouseOver = this._showToolTip;
    handleMouseLeave = this.props.closeToolTip;

    return (
      React.createElement("g", {className: "vcc"}, 
        React.createElement(VoronoiCircle, {
            handleMouseOver: handleMouseOver.bind(this, this.props.dataPoint), 
            handleMouseLeave: handleMouseLeave, 
            voronoiPath: this._drawPath(props.vnode), 
            cx: props.cx, 
            cy: props.cy, 
            circleRadius: this.state.circleRadius, 
            circleFill: this.state.circleFill}
        )
      )
    );
  },

  _showToolTip:function(dataPoint, event){
    console.log(event);
    let x = event.clientX, y = event.clientY;
    this.props.onMouseOver(x, y, dataPoint);
  },

  _animateCircle:function() {
    var rect = this.getDOMNode().getElementsByTagName("circle")[0].getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint )
    this.setState({ 
      circleRadius: this.props.circleRadius * ( 5 / 4 ),
      circleFill: shade(this.props.circleFill, 0.2)
    });
  },

  _restoreCircle:function() {
    this.setState({ 
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    });
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },
});
