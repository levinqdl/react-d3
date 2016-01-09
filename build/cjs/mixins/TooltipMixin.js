'use strict';

var React = require('react');

module.exports =  {

  propTypes: {
    showTooltip:    React.PropTypes.bool,
    tooltipFormat:  React.PropTypes.func
  },

  getDefaultProps:function() {
    return {
      showTooltip:   true,
      tooltipFormat: function(d)  {return String(d.yValue);}
    };
  },

  getInitialState:function() {
    return {
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      }
    };
  },

  onMouseOver:function(x, y, dataPoint) {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        x: x,
        y: y,
        child: this.props.tooltipFormat.call(this, dataPoint),
        show: true 
      } 
    });
  },

  onMouseLeave:function() {
    if(!this.props.showTooltip)
      return;
    this.setState({
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      } 
    });
  }
}