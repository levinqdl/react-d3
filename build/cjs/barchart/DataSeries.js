'use strict';

var React = require('react');
var d3 = require('d3');
var BarContainer = require('./BarContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data:          React.PropTypes.array,
    series:   React.PropTypes.array,
    colors:         React.PropTypes.func,
    colorAccessor:  React.PropTypes.func,
    height:         React.PropTypes.number,
    width:          React.PropTypes.number,
    valuesAccessor: React.PropTypes.func,
  },

  render:function() {
    return (
      React.createElement("g", null, this._renderBarSeries())
    );
  },

  _renderBarSeries:function() {
    var $__0=     this.props,_data=$__0._data,valuesAccessor=$__0.valuesAccessor;
    return _data.map(function(layer, seriesIdx)  {
      return valuesAccessor(layer)
             .map(function(segment)  {return this._renderBarContainer(segment, seriesIdx);}.bind(this))
    }.bind(this));
  },

  _renderBarContainer:function(segment, seriesIdx) {
    var $__0=         this.props,colors=$__0.colors,colorAccessor=$__0.colorAccessor,height=$__0.height,hoverAnimation=$__0.hoverAnimation,xScale=$__0.xScale,yScale=$__0.yScale;
    var barHeight = Math.abs(yScale(0) - yScale(segment.y));
    var y = yScale( segment.y0 + segment.y );
    return (
      React.createElement(BarContainer, {
        height: barHeight, 
        width: xScale.rangeBand(), 
        value: segment.y, 
        x: xScale(segment.x), 
        y: (segment.y >= 0) ? y : y - barHeight, 
        fill: colors(colorAccessor(segment, seriesIdx)), 
        hoverAnimation: hoverAnimation, 
        onMouseOver: this.props.onMouseOver, 
        onMouseLeave: this.props.onMouseLeave, 
        dataPoint: {xValue: segment.x, yValue: segment.y, seriesName: this.props.series[seriesIdx]}}
      )
    )
  }

});
