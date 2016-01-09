'use strict';

var React = require('react');
var d3 = require('d3');
var $__0=      require('../common'),Chart=$__0.Chart,XAxis=$__0.XAxis,YAxis=$__0.YAxis,Tooltip=$__0.Tooltip;
var DataSeries = require('./DataSeries');
var utils = require('../utils');
var $__1=       require('../mixins'),CartesianChartPropsMixin=$__1.CartesianChartPropsMixin,DefaultAccessorsMixin=$__1.DefaultAccessorsMixin,ViewBoxMixin=$__1.ViewBoxMixin,TooltipMixin=$__1.TooltipMixin;

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin ],

  displayName: 'LineChart',

  propTypes: {
    circleRadius:   React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool,
    margins:        React.PropTypes.object,
  },

  getDefaultProps:function() {
    return {
      circleRadius:    3,
      className: 'rd3-linechart',
      hoverAnimation: true,
      margins:        {top: 10, right: 20, bottom: 50, left: 45},
      xAxisClassName: 'rd3-linechart-xaxis',
      yAxisClassName: 'rd3-linechart-yaxis',
    };
  },

  _calculateScales: utils.calculateScales,

  render:function() {

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return null;
    }

    var $__0=     this.getDimensions(),innerWidth=$__0.innerWidth,innerHeight=$__0.innerHeight,trans=$__0.trans,svgMargins=$__0.svgMargins;
    var yOrient = this.getYOrient();

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;
    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues);

    return (
      React.createElement("span", {onMouseLeave: this.onMouseLeave}, 
        React.createElement(Chart, {
          viewBox: this.getViewBox(), 
          legend: props.legend, 
          data: props.data, 
          margins: props.margins, 
          colors: props.colors, 
          colorAccessor: props.colorAccessor, 
          width: props.width, 
          height: props.height, 
          title: props.title
        }, 
          React.createElement("g", {transform: trans, className: props.className}, 
            React.createElement(XAxis, {
              xAxisClassName: props.xAxisClassName, 
              strokeWidth: props.xAxisStrokeWidth, 
              xAxisTickValues: props.xAxisTickValues, 
              xAxisTickInterval: props.xAxisTickInterval, 
              xAxisOffset: props.xAxisOffset, 
              xScale: scales.xScale, 
              xAxisLabel: props.xAxisLabel, 
              xAxisLabelOffset: props.xAxisLabelOffset, 
              tickFormatting: props.xAxisFormatter, 
              xOrient: props.xOrient, 
              yOrient: yOrient, 
              data: props.data, 
              margins: svgMargins, 
              width: innerWidth, 
              height: innerHeight, 
              horizontalChart: props.horizontal, 
              stroke: props.axesColor, 
              gridVertical: props.gridVertical, 
              gridVerticalStroke: props.gridVerticalStroke, 
              gridVerticalStrokeWidth: props.gridVerticalStrokeWidth, 
              gridVerticalStrokeDash: props.gridVerticalStrokeDash}
            ), 
            React.createElement(YAxis, {
              yAxisClassName: props.yAxisClassName, 
              strokeWidth: props.yAxisStrokeWidth, 
              yScale: scales.yScale, 
              yAxisTickValues: props.yAxisTickValues, 
              yAxisTickCount: props.yAxisTickCount, 
              yAxisOffset: props.yAxisOffset, 
              yAxisLabel: props.yAxisLabel, 
              yAxisLabelOffset: props.yAxisLabelOffset, 
              tickFormatting: props.yAxisFormatter, 
              xOrient: props.xOrient, 
              yOrient: yOrient, 
              margins: svgMargins, 
              width: innerWidth, 
              height: innerHeight, 
              horizontalChart: props.horizontal, 
              stroke: props.axesColor, 
              gridHorizontal: props.gridHorizontal, 
              gridHorizontalStroke: props.gridHorizontalStroke, 
              gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth, 
              gridHorizontalStrokeDash: props.gridHorizontalStrokeDash}
            ), 
            React.createElement(DataSeries, {
              xScale: scales.xScale, 
              yScale: scales.yScale, 
              xAccessor: props.xAccessor, 
              yAccessor: props.yAccessor, 
              hoverAnimation: props.hoverAnimation, 
              circleRadius: props.circleRadius, 
              data: props.data, 
              value: allValues, 
              interpolationType: props.interpolationType, 
              colors: props.colors, 
              colorAccessor: props.colorAccessor, 
              width: innerWidth, 
              height: innerHeight, 
              onMouseOver: this.onMouseOver, 
              onCloseToolTip: this.onMouseLeave}
              )
          )
        ), 
        (props.showTooltip ? React.createElement(Tooltip, React.__spread({},  this.state.tooltip)) : null)
      )
    );
  }

});
