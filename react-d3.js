(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rd3 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({

  displayName: 'Area',

  propTypes: {
    path: React.PropTypes.string,
    fill: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: '#3182bd'
    };
  },

  render: function render() {

    return React.createElement('path', {
      className: 'rd3-areachart-area',
      d: this.props.path,
      fill: this.props.fill,
      onMouseOver: this.props.handleMouseOver,
      onMouseLeave: this.props.handleMouseLeave
    });
  }

});

},{}],2:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var DataSeries = require('./DataSeries');

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;

var _require2 = require('../mixins');

var CartesianChartPropsMixin = _require2.CartesianChartPropsMixin;
var DefaultAccessorsMixin = _require2.DefaultAccessorsMixin;
var ViewBoxMixin = _require2.ViewBoxMixin;

module.exports = React.createClass({

  mixins: [CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin],

  displayName: 'AreaChart',

  propTypes: {
    margins: React.PropTypes.object,
    interpolate: React.PropTypes.bool,
    interpolationType: React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      margins: { top: 10, right: 20, bottom: 40, left: 45 },
      yAxisTickCount: 4,
      interpolate: false,
      interpolationType: null,
      className: 'rd3-areachart',
      hoverAnimation: true
    };
  },

  render: function render() {

    var props = this.props;

    var data = props.data;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    var _getDimensions = this.getDimensions();

    var innerWidth = _getDimensions.innerWidth;
    var innerHeight = _getDimensions.innerHeight;
    var trans = _getDimensions.trans;
    var svgMargins = _getDimensions.svgMargins;

    var yOrient = this.getYOrient();

    if (!Array.isArray(data)) {
      data = [data];
    }

    var yScale = d3.scale.linear().range([innerHeight, 0]);

    var xValues = [];
    var yValues = [];
    var seriesNames = [];
    var yMaxValues = [];
    data.forEach(function (series) {
      var upper = 0;
      seriesNames.push(series.name);
      series.values.forEach(function (val, idx) {
        upper = Math.max(upper, props.yAccessor(val));
        xValues.push(props.xAccessor(val));
        yValues.push(props.yAccessor(val));
      });
      yMaxValues.push(upper);
    });

    var xScale;
    if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]' && props.xAxisTickInterval) {
      xScale = d3.time.scale().range([0, innerWidth]);
    } else {
      xScale = d3.scale.linear().range([0, innerWidth]);
    }

    xScale.domain(d3.extent(xValues));
    yScale.domain([0, d3.sum(yMaxValues)]);

    props.colors.domain(seriesNames);

    var stack = d3.layout.stack().x(props.xAccessor).y(props.yAccessor).values(function (d) {
      return d.values;
    });

    var layers = stack(data);

    var dataSeries = layers.map(function (d, idx) {
      return React.createElement(DataSeries, {
        key: idx,
        seriesName: d.name,
        fill: props.colors(props.colorAccessor(d, idx)),
        index: idx,
        xScale: xScale,
        yScale: yScale,
        data: d.values,
        xAccessor: props.xAccessor,
        yAccessor: props.yAccessor,
        interpolationType: interpolationType,
        hoverAnimation: props.hoverAnimation
      });
    });

    return React.createElement(Chart, {
      viewBox: this.getViewBox(),
      legend: props.legend,
      data: data,
      margins: props.margins,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      width: props.width,
      height: props.height,
      title: props.title
    }, React.createElement('g', { transform: trans, className: props.className }, React.createElement(XAxis, {
      xAxisClassName: 'rd3-areachart-xaxis',
      xScale: xScale,
      xAxisTickValues: props.xAxisTickValues,
      xAxisTickInterval: props.xAxisTickInterval,
      xAxisTickCount: props.xAxisTickCount,
      xAxisLabel: props.xAxisLabel,
      xAxisLabelOffset: props.xAxisLabelOffset,
      tickFormatting: props.xAxisFormatter,
      xOrient: props.xOrient,
      yOrient: yOrient,
      margins: svgMargins,
      width: innerWidth,
      height: innerHeight,
      horizontalChart: props.horizontal,
      gridVertical: props.gridVertical,
      gridVerticalStroke: props.gridVerticalStroke,
      gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(YAxis, {
      yAxisClassName: 'rd3-areachart-yaxis',
      yScale: yScale,
      yAxisTickValues: props.yAxisTickValues,
      yAxisTickInterval: props.yAxisTickInterval,
      yAxisTickCount: props.yAxisTickCount,
      yAxisLabel: props.yAxisLabel,
      yAxisLabelOffset: props.yAxisLabelOffset,
      tickFormatting: props.yAxisFormatter,
      xOrient: props.xOrient,
      yOrient: yOrient,
      margins: svgMargins,
      width: innerWidth,
      height: props.height,
      horizontalChart: props.horizontal,
      gridHorizontal: props.gridHorizontal,
      gridHorizontalStroke: props.gridHorizontalStroke,
      gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), dataSeries));
  }

});

},{"../common":30,"../mixins":42,"./DataSeries":4}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var d3 = window.d3;
var shade = require('../utils').shade;
var Area = require('./Area');

module.exports = React.createClass({

  displayName: 'AreaContainer',

  propTypes: {
    fill: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: '#3182bd'
    };
  },

  getInitialState: function getInitialState() {
    return {
      fill: this.props.fill
    };
  },

  render: function render() {

    var props = this.props;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if (props.hoverAnimation) {
      handleMouseOver = this._animateArea;
      handleMouseLeave = this._restoreArea;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return React.createElement(Area, _extends({
      handleMouseOver: handleMouseOver,
      handleMouseLeave: handleMouseLeave
    }, props, {
      fill: this.state.fill
    }));
  },

  _animateArea: function _animateArea() {
    this.setState({
      fill: shade(this.props.fill, 0.02)
    });
  },

  _restoreArea: function _restoreArea() {
    this.setState({
      fill: this.props.fill
    });
  }

});

},{"../utils":58,"./Area":1}],4:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var AreaContainer = require('./AreaContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    fill: React.PropTypes.string,
    interpolationType: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      interpolationType: 'linear'
    };
  },

  render: function render() {

    var props = this.props;

    var area = d3.svg.area().x(function (d) {
      return props.xScale(props.xAccessor(d));
    }).y0(function (d) {
      return props.yScale(d.y0);
    }).y1(function (d) {
      return props.yScale(d.y0 + props.yAccessor(d));
    }).interpolate(props.interpolationType);

    var path = area(props.data);

    return React.createElement(AreaContainer, {
      fill: props.fill,
      hoverAnimation: props.hoverAnimation,
      path: path
    });
  }

});

},{"./AreaContainer":3}],5:[function(require,module,exports){
'use strict';

exports.AreaChart = require('./AreaChart');

},{"./AreaChart":2}],6:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      offset: 0,
      className: 'rd3-barchart-bar'
    };
  },

  render: function render() {
    return React.createElement('g', null, React.createElement('text', { x: this.props.x + this.props.width / 2, y: this.props.y - 5, fontSize: '20', textAnchor: 'middle', alignmentBaseline: 'middle' }, this.props.value), React.createElement('rect', _extends({
      className: 'rd3-barchart-bar'
    }, this.props, {
      fill: this.props.fill,
      onMouseOver: this.props.handleMouseOver,
      onMouseLeave: this.props.handleMouseLeave
    })));
  }
});

},{}],7:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var DataSeries = require('./DataSeries');
var utils = require('../utils');

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;
var Tooltip = _require.Tooltip;

var _require2 = require('../mixins');

var CartesianChartPropsMixin = _require2.CartesianChartPropsMixin;
var DefaultAccessorsMixin = _require2.DefaultAccessorsMixin;
var ViewBoxMixin = _require2.ViewBoxMixin;
var TooltipMixin = _require2.TooltipMixin;

module.exports = React.createClass({

  mixins: [CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin],

  displayName: 'BarChart',

  propTypes: {
    chartClassName: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    hoverAnimation: React.PropTypes.bool,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    rangeRoundBandsPadding: React.PropTypes.number,
    // https://github.com/mbostock/d3/wiki/Stack-Layout#offset
    stackOffset: React.PropTypes.oneOf(['silhouette', 'expand', 'wigget', 'zero']),
    valuesAccessor: React.PropTypes.func,
    title: React.PropTypes.string,
    width: React.PropTypes.number,
    xAxisClassName: React.PropTypes.string,
    yAxisClassName: React.PropTypes.string,
    yAxisTickCount: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      chartClassName: 'rd3-barchart',
      hoverAnimation: true,
      margins: { top: 10, right: 20, bottom: 40, left: 45 },
      rangeRoundBandsPadding: 0.25,
      stackOffset: 'zero',
      valuesAccessor: function valuesAccessor(d) {
        return d.values;
      },
      xAxisClassName: 'rd3-barchart-xaxis',
      yAxisClassName: 'rd3-barchart-yaxis',
      yAxisTickCount: 4,
      xStroke: '#000'
    };
  },

  _getStackedValuesMaxY: function _getStackedValuesMaxY(_data) {
    // in stacked bar chart, the maximum height we need for
    // yScale domain is the sum of y0 + y
    var valuesAccessor = this.props.valuesAccessor;

    return d3.max(_data, function (d) {
      return d3.max(valuesAccessor(d), function (d) {
        // where y0, y is generated by d3.layout.stack()
        return d.y0 + d.y;
      });
    });
  },

  _getStackedValuesMinY: function _getStackedValuesMinY(_data) {
    var valuesAccessor = this.props.valuesAccessor;

    return d3.min(_data, function (d) {
      return d3.min(valuesAccessor(d), function (d) {
        // where y0, y is generated by d3.layout.stack()
        return d.y0 + d.y;
      });
    });
  },

  _getLabels: function _getLabels(firstSeries) {
    // we only need first series to get all the labels
    var _props = this.props;
    var valuesAccessor = _props.valuesAccessor;
    var xAccessor = _props.xAccessor;

    return valuesAccessor(firstSeries).map(xAccessor);
  },

  _stack: function _stack() {
    // Only support columns with all positive or all negative values
    // https://github.com/mbostock/d3/issues/2265
    var _props2 = this.props;
    var stackOffset = _props2.stackOffset;
    var xAccessor = _props2.xAccessor;
    var yAccessor = _props2.yAccessor;
    var valuesAccessor = _props2.valuesAccessor;

    return d3.layout.stack().offset(stackOffset).x(xAccessor).y(yAccessor).values(valuesAccessor);
  },

  render: function render() {

    var props = this.props;
    var yOrient = this.getYOrient();

    var _data = this._stack()(props.data);

    var _getDimensions = this.getDimensions();

    var innerHeight = _getDimensions.innerHeight;
    var innerWidth = _getDimensions.innerWidth;
    var trans = _getDimensions.trans;
    var svgMargins = _getDimensions.svgMargins;

    var xScale = d3.scale.ordinal().domain(this._getLabels(_data[0])).rangeRoundBands([0, innerWidth], props.rangeRoundBandsPadding);

    var yScale = d3.scale.linear().range([innerHeight, 0]).domain([Math.min(0, this._getStackedValuesMinY(_data)), this._getStackedValuesMaxY(_data)]);

    var series = props.data.map(function (item) {
      return item.name;
    });

    return React.createElement('span', null, React.createElement(Chart, {
      viewBox: this.getViewBox(),
      legend: props.legend,
      data: props.data,
      margins: props.margins,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      width: props.width,
      height: props.height,
      title: props.title
    }, React.createElement('g', { transform: trans, className: props.chartClassName }, React.createElement(YAxis, {
      yAxisClassName: props.yAxisClassName,
      yAxisTickValues: props.yAxisTickValues,
      yAxisLabel: props.yAxisLabel,
      yAxisLabelOffset: props.yAxisLabelOffset,
      yScale: yScale,
      margins: svgMargins,
      yAxisTickCount: props.yAxisTickCount,
      tickFormatting: props.yAxisFormatter,
      width: innerWidth,
      height: innerHeight,
      horizontalChart: props.horizontal,
      xOrient: props.xOrient,
      yOrient: yOrient,
      gridHorizontal: props.gridHorizontal,
      gridHorizontalStroke: props.gridHorizontalStroke,
      gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), React.createElement(XAxis, {
      xAxisClassName: props.xAxisClassName,
      xAxisTickValues: props.xAxisTickValues,
      xAxisLabel: props.xAxisLabel,
      xAxisLabelOffset: props.xAxisLabelOffset,
      xScale: xScale,
      margins: svgMargins,
      tickFormatting: props.xAxisFormatter,
      width: innerWidth,
      height: innerHeight,
      horizontalChart: props.horizontal,
      xOrient: props.xOrient,
      yOrient: yOrient,
      stroke: props.xStroke,
      gridVertical: props.gridVertical,
      gridVerticalStroke: props.gridVerticalStroke,
      gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(DataSeries, {
      yScale: yScale,
      xScale: xScale,
      margins: svgMargins,
      _data: _data,
      series: series,
      width: innerWidth,
      height: innerHeight,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      hoverAnimation: props.hoverAnimation,
      valuesAccessor: props.valuesAccessor,
      onMouseOver: this.onMouseOver,
      onMouseLeave: this.onMouseLeave
    }))), props.showTooltip ? React.createElement(Tooltip, this.state.tooltip) : null);
  }

});

},{"../common":30,"../mixins":42,"../utils":58,"./DataSeries":9}],8:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var Bar = require('./Bar');
var shade = require('../utils').shade;

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    fill: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: '#3182BD'
    };
  },

  getInitialState: function getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill
    };
  },

  render: function render() {

    var props = this.props;

    return React.createElement(Bar, _extends({}, props, {
      fill: this.state.fill,
      handleMouseOver: props.hoverAnimation ? this._animateBar : null,
      handleMouseLeave: props.hoverAnimation ? this._restoreBar : null
    }));
  },

  _animateBar: function _animateBar() {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint);
    this.setState({
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreBar: function _restoreBar() {
    this.props.onMouseLeave.call(this);
    this.setState({
      fill: this.props.fill
    });
  }
});

},{"../utils":58,"./Bar":6}],9:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var BarContainer = require('./BarContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data: React.PropTypes.array,
    series: React.PropTypes.array,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    valuesAccessor: React.PropTypes.func
  },

  render: function render() {
    return React.createElement('g', null, this._renderBarSeries());
  },

  _renderBarSeries: function _renderBarSeries() {
    var _this = this;

    var _props = this.props;
    var _data = _props._data;
    var valuesAccessor = _props.valuesAccessor;

    return _data.map(function (layer, seriesIdx) {
      return valuesAccessor(layer).map(function (segment) {
        return _this._renderBarContainer(segment, seriesIdx);
      });
    });
  },

  _renderBarContainer: function _renderBarContainer(segment, seriesIdx) {
    var _props2 = this.props;
    var colors = _props2.colors;
    var colorAccessor = _props2.colorAccessor;
    var height = _props2.height;
    var hoverAnimation = _props2.hoverAnimation;
    var xScale = _props2.xScale;
    var yScale = _props2.yScale;

    var barHeight = Math.abs(yScale(0) - yScale(segment.y));
    var y = yScale(segment.y0 + segment.y);
    return React.createElement(BarContainer, {
      height: barHeight,
      width: xScale.rangeBand(),
      value: segment.y,
      x: xScale(segment.x),
      y: segment.y >= 0 ? y : y - barHeight,
      fill: colors(colorAccessor(segment, seriesIdx)),
      hoverAnimation: hoverAnimation,
      onMouseOver: this.props.onMouseOver,
      onMouseLeave: this.props.onMouseLeave,
      dataPoint: { xValue: segment.x, yValue: segment.y, seriesName: this.props.series[seriesIdx] }
    });
  }

});

},{"./BarContainer":8}],10:[function(require,module,exports){
'use strict';

exports.BarChart = require('./BarChart');

},{"./BarChart":7}],11:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({

  displayName: 'Candle',

  propTypes: {
    className: React.PropTypes.string,
    shapeRendering: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-candlestick-candle',
      shapeRendering: 'crispEdges',
      stroke: '#000',
      strokeWidth: 1
    };
  },

  render: function render() {
    var props = this.props;

    return React.createElement('rect', {
      className: props.className,
      fill: props.candleFill,
      x: props.candle_x,
      y: props.candle_y,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      style: { shapeRendering: props.shapeRendering },
      width: props.candleWidth,
      height: props.candleHeight,
      onMouseOver: props.handleMouseOver,
      onMouseLeave: props.handleMouseLeave
    });
  }

});

},{}],12:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var utils = require('../utils');
var DataSeries = require('./DataSeries');

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;

var _require2 = require('../mixins');

var ViewBoxMixin = _require2.ViewBoxMixin;
var CartesianChartPropsMixin = _require2.CartesianChartPropsMixin;

module.exports = React.createClass({

  mixins: [CartesianChartPropsMixin, ViewBoxMixin],

  displayName: 'CandleStickChart',

  propTypes: {
    data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
    fillUp: React.PropTypes.func,
    fillUpAccessor: React.PropTypes.func,
    fillDown: React.PropTypes.func,
    fillDownAccessor: React.PropTypes.func,
    hoverAnimation: React.PropTypes.bool,
    xAxisFormatter: React.PropTypes.func,
    xAxisTickInterval: React.PropTypes.object,
    xAxisTickValues: React.PropTypes.array,
    yAxisFormatter: React.PropTypes.func,
    yAxisTickCount: React.PropTypes.number,
    yAxisTickValues: React.PropTypes.array
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-candlestick',
      xAxisClassName: 'rd3-candlestick-xaxis',
      yAxisClassName: 'rd3-candlestick-yaxis',
      data: [],
      fillUp: function fillUp(value) {
        return '#ffffff';
      },
      fillUpAccessor: function fillUpAccessor(d, idx) {
        return idx;
      },
      fillDown: d3.scale.category20c(),
      fillDownAccessor: function fillDownAccessor(d, idx) {
        return idx;
      },
      hoverAnimation: true,
      margins: { top: 10, right: 20, bottom: 30, left: 45 },
      xAccessor: function xAccessor(d) {
        return d.x;
      },
      yAccessor: function yAccessor(d) {
        return { open: d.open, high: d.high, low: d.low, close: d.close };
      }
    };
  },

  render: function render() {

    var props = this.props;

    var _getDimensions = this.getDimensions();

    var innerWidth = _getDimensions.innerWidth;
    var innerHeight = _getDimensions.innerHeight;
    var trans = _getDimensions.trans;
    var svgMargins = _getDimensions.svgMargins;

    var yOrient = this.getYOrient();

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;
    var scales = utils.calculateScales(innerWidth, innerHeight, xValues, yValues);

    var dataSeries = props.data.map(function (series, idx) {
      return React.createElement(DataSeries, {
        key: idx,
        seriesName: series.name,
        index: idx,
        xScale: scales.xScale,
        yScale: scales.yScale,
        data: series.values,
        fillUp: props.fillUp(props.fillUpAccessor(series, idx)),
        fillDown: props.fillDown(props.fillDownAccessor(series, idx)),
        xAccessor: props.xAccessor,
        yAccessor: props.yAccessor,
        hoverAnimation: props.hoverAnimation
      });
    });

    return React.createElement(Chart, {
      viewBox: this.getViewBox(),
      width: props.width,
      height: props.height,
      margins: props.margins,
      title: props.title
    }, React.createElement('g', { transform: trans, className: props.className }, React.createElement(XAxis, {
      xAxisClassName: props.xAxisClassName,
      xScale: scales.xScale,
      xAxisTickValues: props.xAxisTickValues,
      xAxisTickInterval: props.xAxisTickInterval,
      xAxisOffset: props.xAxisOffset,
      tickFormatting: props.xAxisFormatter,
      xAxisLabel: props.xAxisLabel,
      xAxisLabelOffset: props.xAxisLabelOffset,
      xOrient: props.xOrient,
      yOrient: yOrient,
      margins: svgMargins,
      width: innerWidth,
      height: innerHeight,
      horizontalChart: props.horizontal,
      gridVertical: props.gridVertical,
      gridVerticalStroke: props.gridVerticalStroke,
      gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(YAxis, {
      yAxisClassName: props.yAxisClassName,
      yScale: scales.yScale,
      yAxisTickValues: props.yAxisTickValues,
      yAxisOffset: props.yAxisOffset,
      yAxisTickCount: props.yAxisTickCount,
      tickFormatting: props.yAxisFormatter,
      yAxisLabel: props.yAxisLabel,
      yAxisLabelOffset: props.yAxisLabelOffset,
      xOrient: props.xOrient,
      yOrient: yOrient,
      margins: svgMargins,
      width: innerWidth,
      height: props.height,
      horizontalChart: props.horizontal,
      gridHorizontal: props.gridHorizontal,
      gridHorizontalStroke: props.gridHorizontalStroke,
      gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), dataSeries));
  }

});

},{"../common":30,"../mixins":42,"../utils":58,"./DataSeries":14}],13:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var utils = require('../utils');
var Candle = require('./Candle');
var Wick = require('./Wick');

module.exports = React.createClass({

  displayName: 'CandleStickContainer',

  propTypes: {
    candle_x: React.PropTypes.number,
    candle_y: React.PropTypes.number,
    className: React.PropTypes.string,
    candleFill: React.PropTypes.string,
    candleHeight: React.PropTypes.number,
    candleWidth: React.PropTypes.number,
    wick_x1: React.PropTypes.number,
    wick_x2: React.PropTypes.number,
    wick_y1: React.PropTypes.number,
    wick_y2: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-candlestick-container'
    };
  },

  getInitialState: function getInitialState() {
    // state for animation usage
    return {
      candleWidth: this.props.candleWidth,
      candleFill: this.props.candleFill
    };
  },

  render: function render() {

    var props = this.props;
    var state = this.state;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if (props.hoverAnimation) {
      handleMouseOver = this._animateCandle;
      handleMouseLeave = this._restoreCandle;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    return React.createElement('g', { className: props.className }, React.createElement(Wick, {
      wick_x1: props.wick_x1,
      wick_x2: props.wick_x2,
      wick_y1: props.wick_y1,
      wick_y2: props.wick_y2
    }), React.createElement(Candle, {
      candleFill: state.candleFill,
      candleWidth: state.candleWidth,
      candle_x: props.candle_x - (state.candleWidth - props.candleWidth) / 2,
      candle_y: props.candle_y,
      candleHeight: props.candleHeight,
      handleMouseOver: handleMouseOver,
      handleMouseLeave: handleMouseLeave
    }));
  },

  _animateCandle: function _animateCandle() {
    this.setState({
      candleWidth: this.props.candleWidth * 1.5,
      candleFill: utils.shade(this.props.candleFill, -0.2)
    });
  },

  _restoreCandle: function _restoreCandle() {
    this.setState({
      candleWidth: this.props.candleWidth,
      candleFill: this.props.candleFill
    });
  }

});

},{"../utils":58,"./Candle":11,"./Wick":15}],14:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var utils = require('../utils');
var CandlestickContainer = require('./CandlestickContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    fillUp: React.PropTypes.string.isRequired,
    fillDown: React.PropTypes.string.isRequired
  },

  render: function render() {

    var props = this.props;

    var xRange = props.xScale.range(),
        width = Math.abs(xRange[0] - xRange[1]),
        candleWidth = width / (props.data.length + 2) * 0.5;

    var dataSeriesArray = props.data.map(function (d, idx) {
      // Candles
      var ohlc = props.yAccessor(d),
          candle_x = props.xScale(props.xAccessor(d)) - 0.5 * candleWidth,
          candle_y = props.yScale(Math.max(ohlc.open, ohlc.close)),
          candleHeight = Math.abs(props.yScale(ohlc.open) - props.yScale(ohlc.close)),
          wick_y2 = props.yScale(ohlc.low),
          ohlcClass = ohlc.open <= ohlc.close ? 'up' : 'down',
          className = ohlcClass + ' rd3-candlestick-rect',
          candleFill = ohlc.open <= ohlc.close ? props.fillUp : props.fillDown;

      //Wicks
      var wick_x1 = props.xScale(props.xAccessor(d)),
          wick_y1 = props.yScale(ohlc.high),
          wick_x2 = wick_x1;

      return React.createElement(CandlestickContainer, {
        key: idx,
        candleFill: candleFill,
        candleHeight: candleHeight,
        candleWidth: candleWidth,
        candle_x: candle_x,
        candle_y: candle_y,
        wick_x1: wick_x1,
        wick_x2: wick_x2,
        wick_y1: wick_y1,
        wick_y2: wick_y2,
        hoverAnimation: props.hoverAnimation
      });
    }, this);

    return React.createElement('g', null, dataSeriesArray);
  }

});

},{"../utils":58,"./CandlestickContainer":13}],15:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({

  displayName: 'Wick',

  propTypes: {
    className: React.PropTypes.string,
    shapeRendering: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-candlestick-wick',
      stroke: '#000',
      strokeWidth: 1,
      shapeRendering: 'crispEdges'
    };
  },

  render: function render() {
    var props = this.props;
    return React.createElement('line', {
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      style: { shapeRendering: props.shapeRendering },
      className: props.className,
      x1: props.wick_x1,
      y1: props.wick_y1,
      x2: props.wick_x2,
      y2: props.wick_y2
    });
  }

});

},{}],16:[function(require,module,exports){
'use strict';

exports.CandlestickChart = require('./CandlestickChart');

},{"./CandlestickChart":12}],17:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'Legend',

  propTypes: {
    className: React.PropTypes.string,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array.isRequired,
    itemClassName: React.PropTypes.string,
    margins: React.PropTypes.object,
    text: React.PropTypes.string,
    width: React.PropTypes.number.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-legend',
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      },
      itemClassName: 'rd3-legend-item',
      text: '#000'
    };
  },

  render: function render() {

    var props = this.props;

    var textStyle = {
      'color': 'black',
      'fontSize': '50%',
      'verticalAlign': 'top'
    };

    var legendItems = [];

    props.data.forEach(function (series, idx) {
      var itemStyle = {
        'color': props.colors(props.colorAccessor(series, idx)),
        'lineHeight': '60%',
        'fontSize': '200%'
      };

      legendItems.push(React.createElement('li', {
        key: idx,
        className: props.itemClassName,
        style: itemStyle
      }, React.createElement('span', {
        style: textStyle
      }, series.name)));
    });

    var topMargin = props.margins.top;

    var legendBlockStyle = {
      'wordWrap': 'break-word',
      'width': props.width,
      'paddingLeft': '0',
      'marginBottom': '0',
      'marginTop': topMargin,
      'listStylePosition': 'inside'
    };

    return React.createElement('ul', {
      className: props.className,
      style: legendBlockStyle
    }, legendItems);
  }

});

},{}],18:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    child: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.element]),
    show: React.PropTypes.bool
  },

  render: function render() {
    var props = this.props;
    var display = this.props.show ? 'inherit' : 'none';
    var containerStyles = { position: 'fixed', top: props.y, left: props.x, display: display, opacity: 0.8 };

    //TODO: add 'right: 0px' style when tooltip is off the chart
    var tooltipStyles = {
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid',
      borderColor: '#ddd',
      borderRadius: '2px',
      padding: '10px',
      marginLeft: '10px',
      marginRight: '10px',
      marginTop: '-15px'
    };
    return React.createElement('div', { style: containerStyles }, React.createElement('div', { style: tooltipStyles }, props.child));
  }
});

},{}],19:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

var Polygon = React.createClass({
  displayName: 'Polygon',

  _animateCircle: function _animateCircle() {
    this.props.structure.cursor('voronoi').cursor(this.props.id).update(function () {
      return 'active';
    });
    // this.props.pubsub.emit('animate', this.props.id);
  },

  _restoreCircle: function _restoreCircle() {
    this.props.structure.cursor('voronoi').cursor(this.props.id).update(function () {
      return 'inactive';
    });
    // this.props.pubsub.emit('restore', this.props.id);
  },

  _drawPath: function _drawPath(d) {
    if (d === undefined) {
      return;
    }
    return 'M' + d.join(',') + 'Z';
  },

  render: function render() {
    return React.createElement('path', {
      onMouseOver: this._animateCircle,
      onMouseOut: this._restoreCircle,
      fill: 'white',
      opacity: '0',
      d: this._drawPath(this.props.vnode) });
  }

});

module.exports = React.createClass({

  displayName: 'Voronoi',

  render: function render() {
    var xScale = this.props.xScale;
    var yScale = this.props.yScale;

    var voronoi = d3.geom.voronoi().x(function (d) {
      return xScale(d.coord.x);
    }).y(function (d) {
      return yScale(d.coord.y);
    }).clipExtent([[0, 0], [this.props.width, this.props.height]]);

    var regions = voronoi(this.props.data).map((function (vnode, idx) {
      return React.createElement(Polygon, { structure: this.props.structure, key: idx, id: vnode.point.id, vnode: vnode });
    }).bind(this));

    return React.createElement('g', null, regions);
  }

});

},{}],20:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'AxisLine',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickArguments: React.PropTypes.array,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      fill: 'none',
      tickArguments: [10],
      tickValues: null,
      tickFormat: null
    };
  },

  _d3_scaleExtent: function _d3_scaleExtent(domain) {
    var start = domain[0],
        stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },

  _d3_scaleRange: function _d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
  },

  render: function render() {

    var props = this.props;
    var sign = props.orient === "top" || props.orient === "left" ? -1 : 1;

    var range = this._d3_scaleRange(props.scale);

    var d;

    if (props.orient === "bottom" || props.orient === "top") {
      d = "M" + range[0] + "," + sign * props.outerTickSize + "V0H" + range[1] + "V" + sign * props.outerTickSize;
    } else {
      d = "M" + sign * props.outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * props.outerTickSize;
    }

    return React.createElement('path', {
      className: 'domain',
      d: d,
      style: { 'shapeRendering': 'crispEdges' },
      fill: props.fill,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth
    });
  }
});

},{}],21:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'AxisTick',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    orient: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
    orient2nd: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    horizontal: React.PropTypes.bool,
    tickArguments: React.PropTypes.array,
    tickValues: React.PropTypes.array,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickFormat: React.PropTypes.func,
    tickStroke: React.PropTypes.string,
    gridHorizontal: React.PropTypes.bool,
    gridVertical: React.PropTypes.bool,
    gridHorizontalStroke: React.PropTypes.string,
    gridVerticalStroke: React.PropTypes.string,
    gridHorizontalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridHorizontalStrokeDash: React.PropTypes.string,
    gridVerticalStrokeDash: React.PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickStroke: '#000',
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      gridHorizontal: false,
      gridVertical: false,
      gridHorizontalStroke: '#D8D7D7',
      gridVerticalStroke: '#D8D7D7',
      gridHorizontalStrokeWidth: 1,
      gridVerticalStrokeWidth: 1,
      gridHorizontalStrokeDash: '5, 5',
      gridVerticalStrokeDash: '5, 5'
    };
  },

  render: function render() {
    var props = this.props;

    var tr, ticks, scale, adjustedScale, orient, textAnchor, textTransform, tickFormat, y0, y1, y2, dy, x0, x1, x2, dx;

    var gridStrokeWidth, gridStroke, gridStrokeDashArray, x2grid, y2grid;
    var gridOn = false;

    var sign = props.orient === 'top' || props.orient === 'right' ? -1 : 1;
    var tickSpacing = Math.max(props.innerTickSize, 0) + props.tickPadding;

    scale = props.scale;

    if (props.tickValues) {
      ticks = props.tickValues;
    } else if (scale.ticks) {
      ticks = scale.ticks.apply(scale, props.tickArguments);
    } else {
      ticks = scale.domain();
    }

    if (props.tickFormatting) {
      tickFormat = props.tickFormatting;
    } else if (scale.tickFormat) {
      tickFormat = scale.tickFormat.apply(scale, props.tickArguments);
    } else {
      tickFormat = function (d) {
        return d;
      };
    }

    adjustedScale = scale.rangeBand ? function (d) {
      return scale(d) + scale.rangeBand() / 2;
    } : scale;

    // Still working on this
    // Ticks and lines are not fully aligned
    // in some orientations
    switch (props.orient) {
      case 'top':
        tr = function (tick) {
          return 'translate(' + adjustedScale(tick) + ',0)';
        };
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy = sign < 0 ? "0em" : ".71em";
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'bottom':
        tr = function (tick) {
          return 'translate(' + adjustedScale(tick) + ',0)';
        };
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy = sign < 0 ? "0em" : ".71em";
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'left':
        tr = function (tick) {
          return 'translate(0,' + adjustedScale(tick) + ')';
        };
        textAnchor = "end";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = ".32em";
        x2grid = props.width;
        y2grid = 0;
        break;
      case 'right':
        tr = function (tick) {
          return 'translate(0,' + adjustedScale(tick) + ')';
        };
        textAnchor = "start";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = ".32em";
        x2grid = -props.width;
        y2grid = 0;
        break;
    }

    if (props.horizontalChart) {
      textTransform = "rotate(-90)";
      var _ref = [x1, -y1 || 0];
      y1 = _ref[0];
      x1 = _ref[1];

      switch (props.orient) {
        case 'top':
          textAnchor = "start";
          dy = ".32em";
          break;
        case 'bottom':
          textAnchor = "end";
          dy = ".32em";
          break;
        case 'left':
          textAnchor = 'middle';
          dy = sign < 0 ? ".71em" : "0em";
          break;
        case 'right':
          textAnchor = 'middle';
          dy = sign < 0 ? ".71em" : "0em";
          break;
      }
    }

    if (props.gridHorizontal) {
      gridOn = true;
      gridStrokeWidth = props.gridHorizontalStrokeWidth;
      gridStroke = props.gridHorizontalStroke;
      gridStrokeDashArray = props.gridHorizontalStrokeDash;
    } else if (props.gridVertical) {
      gridOn = true;
      gridStrokeWidth = props.gridVerticalStrokeWidth;
      gridStroke = props.gridVerticalStroke;
      gridStrokeDashArray = props.gridVerticalStrokeDash;
    }

    // return grid line if grid is enabled and grid line is not on at same position as other axis.
    var gridLine = function gridLine(pos) {
      if (gridOn && !(props.orient2nd == 'left' && pos == 0) && !(props.orient2nd == 'right' && pos == props.width) && !((props.orient == 'left' || props.orient == 'right') && pos == props.height)) {
        return React.createElement('line', { style: {
            strokeWidth: gridStrokeWidth,
            shapeRendering: 'crispEdges',
            stroke: gridStroke,
            strokeDasharray: gridStrokeDashArray
          }, x2: x2grid, y2: y2grid });
      }
    };

    var optionalTextProps = textTransform ? {
      transform: textTransform
    } : {};

    return React.createElement('g', null, ticks.map(function (tick, idx) {
      return React.createElement('g', { key: idx, className: 'tick', transform: tr(tick) }, gridLine(adjustedScale(tick)), React.createElement('line', { style: { shapeRendering: 'crispEdges', opacity: '1', stroke: props.tickStroke }, x2: x2, y2: y2 }), React.createElement('text', _extends({
        strokeWidth: '0.01',
        dy: dy, x: x1, y: y1,
        style: { stroke: props.tickTextStroke, fill: props.tickTextStroke },
        textAnchor: textAnchor
      }, optionalTextProps), tickFormat(tick)));
    }));
  }

});

},{}],22:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({

  displayName: 'Label',

  propTypes: {
    height: React.PropTypes.number,
    horizontalChart: React.PropTypes.bool,
    horizontalTransform: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    strokeWidth: React.PropTypes.number,
    textAnchor: React.PropTypes.string,
    verticalTransform: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      horizontalTransform: 'rotate(270)',
      strokeWidth: 0.01,
      textAnchor: 'middle',
      verticalTransform: 'rotate(0)'
    };
  },

  render: function render() {

    var props = this.props;

    if (!props.label) {
      return React.createElement('text', null);
    }

    var transform, x, y;
    if (props.orient === 'top' || props.orient === 'bottom') {
      transform = props.verticalTransform;
      x = props.width / 2;
      y = props.offset;

      if (props.horizontalChart) {
        transform = 'rotate(180 ' + x + ' ' + y + ') ' + transform;
      }
    } else {
      // left, right
      transform = props.horizontalTransform;
      x = -props.height / 2;
      if (props.orient === 'left') {
        y = -props.offset;
      } else {
        y = props.offset;
      }
    }

    return React.createElement('text', {
      strokeWidth: props.strokeWidth.toString(),
      textAnchor: props.textAnchor,
      transform: transform,
      y: y,
      x: x
    }, props.label);
  }

});

},{}],23:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var d3 = window.d3;
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'XAxis',

  propTypes: {
    fill: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    horizontalChart: React.PropTypes.bool,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    xAxisClassName: React.PropTypes.string,
    xAxisLabel: React.PropTypes.string,
    xAxisTickValues: React.PropTypes.array,
    xAxisOffset: React.PropTypes.number,
    xScale: React.PropTypes.func.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    gridVertical: React.PropTypes.bool,
    gridVerticalStroke: React.PropTypes.string,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeDash: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: 'none',
      strokeWidth: '1',
      tickStroke: '#000',
      xAxisClassName: 'rd3-x-axis',
      xAxisLabel: '',
      xAxisLabelOffset: 10,
      xAxisOffset: 0,
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render: function render() {
    var props = this.props;

    var t = 'translate(0 ,' + (props.xAxisOffset + props.height) + ')';

    var tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }

    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }

    return React.createElement('g', {
      className: props.xAxisClassName,
      transform: t
    }, React.createElement(AxisTicks, {
      tickValues: props.xAxisTickValues,
      tickFormatting: props.tickFormatting,
      tickArguments: tickArguments,
      tickStroke: props.tickStroke,
      tickTextStroke: props.tickTextStroke,
      innerTickSize: props.tickSize,
      scale: props.xScale,
      orient: props.xOrient,
      orient2nd: props.yOrient,
      height: props.height,
      width: props.width,
      horizontalChart: props.horizontalChart,
      gridVertical: props.gridVertical,
      gridVerticalStroke: props.gridVerticalStroke,
      gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(AxisLine, _extends({
      scale: props.xScale,
      stroke: props.stroke,
      orient: props.xOrient,
      outerTickSize: props.tickSize
    }, props)), React.createElement(Label, {
      horizontalChart: props.horizontalChart,
      label: props.xAxisLabel,
      offset: props.xAxisLabelOffset,
      orient: props.xOrient,
      margins: props.margins,
      width: props.width
    }));
  }

});

},{"./AxisLine":20,"./AxisTicks":21,"./Label":22}],24:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var d3 = window.d3;
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'YAxis',

  propTypes: {
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    horizontalChart: React.PropTypes.bool,
    yAxisClassName: React.PropTypes.string,
    yAxisLabel: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number,
    yAxisTickValues: React.PropTypes.array,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    gridVertical: React.PropTypes.bool,
    gridVerticalStroke: React.PropTypes.string,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeDash: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      fill: 'none',
      stroke: '#000',
      strokeWidth: '1',
      tickStroke: '#000',
      yAxisClassName: 'rd3-y-axis',
      yAxisLabel: '',
      yAxisOffset: 0,
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render: function render() {

    var props = this.props;

    var t;
    if (props.yOrient === 'right') {
      t = 'translate(' + (props.yAxisOffset + props.width) + ', 0)';
    } else {
      t = 'translate(' + props.yAxisOffset + ', 0)';
    }

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }

    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return React.createElement('g', {
      className: props.yAxisClassName,
      transform: t
    }, React.createElement(AxisTicks, {
      innerTickSize: props.tickSize,
      orient: props.yOrient,
      orient2nd: props.xOrient,
      tickArguments: tickArguments,
      tickFormatting: props.tickFormatting,
      tickStroke: props.tickStroke,
      tickTextStroke: props.tickTextStroke,
      tickValues: props.yAxisTickValues,
      scale: props.yScale,
      height: props.height,
      width: props.width,
      horizontalChart: props.horizontalChart,
      gridHorizontal: props.gridHorizontal,
      gridHorizontalStroke: props.gridHorizontalStroke,
      gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), React.createElement(AxisLine, _extends({
      orient: props.yOrient,
      outerTickSize: props.tickSize,
      scale: props.yScale,
      stroke: props.stroke
    }, props)), React.createElement(Label, {
      height: props.height,
      horizontalChart: props.horizontalChart,
      label: props.yAxisLabel,
      margins: props.margins,
      offset: props.yAxisLabelOffset,
      orient: props.yOrient
    }));
  }

});

},{"./AxisLine":20,"./AxisTicks":21,"./Label":22}],25:[function(require,module,exports){
'use strict';

exports.XAxis = require('./XAxis');
exports.YAxis = require('./YAxis');

},{"./XAxis":23,"./YAxis":24}],26:[function(require,module,exports){
'use strict';

var React = window.React;
var mixins = require('../../mixins');

module.exports = React.createClass({

  displayName: 'BasicChart',

  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    height: React.PropTypes.node,
    svgClassName: React.PropTypes.string,
    title: React.PropTypes.node,
    titleClassName: React.PropTypes.string,
    width: React.PropTypes.node
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-basic-chart',
      svgClassName: 'rd3-chart',
      titleClassName: 'rd3-chart-title'
    };
  },

  _renderTitle: function _renderTitle() {
    var props = this.props;

    if (props.title != '' && props.title != null) {
      return React.createElement('h4', {
        className: props.titleClassName
      }, props.title);
    } else {
      return null;
    }
  },

  _renderChart: function _renderChart() {
    var props = this.props;

    return React.createElement('svg', {
      className: props.svgClassName,
      height: props.height,
      viewBox: props.viewBox,
      width: props.width
    }, props.children);
  },

  render: function render() {
    var props = this.props;

    return React.createElement('div', {
      className: props.className
    }, this._renderTitle(), this._renderChart());
  }
});

},{"../../mixins":42}],27:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var LegendChart = require('./LegendChart');
var BasicChart = require('./BasicChart');

module.exports = React.createClass({

  displayName: 'Chart',

  propTypes: {
    legend: React.PropTypes.bool,
    svgClassName: React.PropTypes.string,
    titleClassName: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      legend: false,
      svgClassName: 'rd3-chart',
      titleClassName: 'rd3-chart-title'
    };
  },

  render: function render() {
    var props = this.props;

    if (props.legend) {
      return React.createElement(LegendChart, _extends({
        svgClassName: props.svgClassName,
        titleClassName: props.titleClassName
      }, this.props));
    }
    return React.createElement(BasicChart, _extends({
      svgClassName: props.svgClassName,
      titleClassName: props.titleClassName
    }, this.props));
  }

});

},{"./BasicChart":26,"./LegendChart":28}],28:[function(require,module,exports){
'use strict';

var React = window.React;
var Legend = require('../Legend');
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'LegendChart',

  propTypes: {
    children: React.PropTypes.node,
    createClass: React.PropTypes.string,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    height: React.PropTypes.node,
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    margins: React.PropTypes.object,
    sideOffset: React.PropTypes.number,
    svgClassName: React.PropTypes.string,
    title: React.PropTypes.node,
    titleClassName: React.PropTypes.string,
    viewBox: React.PropTypes.string,
    width: React.PropTypes.node
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-legend-chart',
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      },
      data: [],
      legend: false,
      legendPosition: 'right',
      sideOffset: 90,
      svgClassName: 'rd3-chart',
      titleClassName: 'rd3-chart-title'
    };
  },

  _renderLegend: function _renderLegend() {
    var props = this.props;

    if (props.legend) {
      return React.createElement(Legend, {
        colors: props.colors,
        colorAccessor: props.colorAccessor,
        data: props.data,
        legendPosition: props.legendPosition,
        margins: props.margins,
        width: props.sideOffset
      });
    }
  },

  _renderTitle: function _renderTitle() {
    var props = this.props;

    if (props.title != '' && props.title != null) {
      return React.createElement('h4', {
        className: props.titleClassName
      }, props.title);
    }
    return null;
  },

  _renderChart: function _renderChart() {
    var props = this.props;

    return React.createElement('svg', {
      className: props.svgClassName,
      height: '100%',
      viewBox: props.viewBox,
      width: '100%'
    }, props.children);
  },

  render: function render() {
    var props = this.props;

    return React.createElement('div', {
      className: props.className,
      style: { 'width': props.width, 'height': props.height }
    }, this._renderTitle(), React.createElement('div', { style: { display: 'table', width: '100%', height: '100%' } }, React.createElement('div', { style: { display: 'table-cell' } }, this._renderChart()), React.createElement('div', { style: { display: 'table-cell', width: props.sideOffset, 'verticalAlign': 'top' } }, this._renderLegend())));
  }
});

},{"../Legend":17}],29:[function(require,module,exports){
'use strict';

exports.BasicChart = require('./BasicChart');
exports.Chart = require('./Chart');
exports.LegendChart = require('./LegendChart');

},{"./BasicChart":26,"./Chart":27,"./LegendChart":28}],30:[function(require,module,exports){
'use strict';

exports.XAxis = require('./axes').XAxis;
exports.YAxis = require('./axes').YAxis;
exports.Chart = require('./charts').Chart;
exports.LegendChart = require('./charts').LegendChart;
exports.Legend = require('./Legend');
exports.Tooltip = require('./Tooltip');
exports.Voronoi = require('./Voronoi');

},{"./Legend":17,"./Tooltip":18,"./Voronoi":19,"./axes":25,"./charts":29}],31:[function(require,module,exports){
'use strict';

exports.BarChart = require('./barchart').BarChart;
exports.LineChart = require('./linechart').LineChart;
exports.PieChart = require('./piechart').PieChart;
exports.AreaChart = require('./areachart').AreaChart;
exports.Treemap = require('./treemap').Treemap;
exports.ScatterChart = require('./scatterchart').ScatterChart;
exports.CandlestickChart = require('./candlestick').CandlestickChart;

},{"./areachart":5,"./barchart":10,"./candlestick":16,"./linechart":37,"./piechart":47,"./scatterchart":52,"./treemap":57}],32:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var VoronoiCircleContainer = require('./VoronoiCircleContainer');
var Line = require('./Line');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    color: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      xAccessor: function xAccessor(d) {
        return d.x;
      },
      yAccessor: function yAccessor(d) {
        return d.y;
      },
      interpolationType: 'linear',
      hoverAnimation: false
    };
  },

  _isDate: function _isDate(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render: function render() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;

    var interpolatePath = d3.svg.line().y(function (d) {
      return props.yScale(yAccessor(d));
    }).interpolate(props.interpolationType);

    if (this._isDate(props.data[0].values[0], xAccessor)) {
      interpolatePath.x(function (d) {
        return props.xScale(props.xAccessor(d).getTime());
      });
    } else {
      interpolatePath.x(function (d) {
        return props.xScale(props.xAccessor(d));
      });
    }

    var lines = props.data.map(function (series, idx) {
      return React.createElement(Line, {
        path: interpolatePath(series.values),
        stroke: props.colors(props.colorAccessor(series, idx)),
        strokeWidth: series.strokeWidth,
        strokeDashArray: series.strokeDashArray,
        seriesName: series.name,
        key: idx
      });
    });

    var voronoi = d3.geom.voronoi().x(function (d) {
      return xScale(d.coord.x);
    }).y(function (d) {
      return yScale(d.coord.y);
    }).clipExtent([[0, 0], [props.width, props.height]]);

    var cx, cy, circleFill;
    var regions = voronoi(props.value).map((function (vnode, idx) {
      var point = vnode.point.coord;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }
      circleFill = props.colors(props.colorAccessor(vnode, vnode.point.seriesIndex));

      return React.createElement(VoronoiCircleContainer, {
        key: idx,
        circleFill: circleFill,
        vnode: vnode,
        hoverAnimation: props.hoverAnimation,
        cx: cx, cy: cy,
        circleRadius: props.circleRadius,
        onMouseOver: props.onMouseOver,
        closeTooltip: props.handleCloseTooltip,
        dataPoint: { xValue: xAccessor(point), yValue: yAccessor(point), seriesName: vnode.point.series.name }
      });
    }).bind(this));

    return React.createElement('g', { className: 'xxxyyy' }, React.createElement('g', null, regions), React.createElement('g', null, lines));
  }

});

},{"./Line":33,"./VoronoiCircleContainer":36}],33:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    fill: React.PropTypes.string,
    path: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    strokeDashArray: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      stroke: '#3182bd',
      fill: 'none',
      strokeWidth: 1,
      className: 'rd3-linechart-path'
    };
  },

  render: function render() {
    var props = this.props;
    return React.createElement('path', {
      d: props.path,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      strokeDasharray: props.strokeDashArray,
      fill: props.fill,
      className: props.className
    });
  }

});

},{}],34:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;
var Tooltip = _require.Tooltip;

var DataSeries = require('./DataSeries');
var utils = require('../utils');

var _require2 = require('../mixins');

var CartesianChartPropsMixin = _require2.CartesianChartPropsMixin;
var DefaultAccessorsMixin = _require2.DefaultAccessorsMixin;
var ViewBoxMixin = _require2.ViewBoxMixin;
var TooltipMixin = _require2.TooltipMixin;

module.exports = React.createClass({

  mixins: [CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin],

  displayName: 'LineChart',

  propTypes: {
    circleRadius: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool,
    margins: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      circleRadius: 3,
      className: 'rd3-linechart',
      hoverAnimation: true,
      margins: { top: 10, right: 20, bottom: 50, left: 45 },
      xAxisClassName: 'rd3-linechart-xaxis',
      yAxisClassName: 'rd3-linechart-yaxis'
    };
  },

  _calculateScales: utils.calculateScales,

  render: function render() {

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return null;
    }

    var _getDimensions = this.getDimensions();

    var innerWidth = _getDimensions.innerWidth;
    var innerHeight = _getDimensions.innerHeight;
    var trans = _getDimensions.trans;
    var svgMargins = _getDimensions.svgMargins;

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

    return React.createElement('span', { onMouseLeave: this.onMouseLeave }, React.createElement(Chart, {
      viewBox: this.getViewBox(),
      legend: props.legend,
      data: props.data,
      margins: props.margins,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      width: props.width,
      height: props.height,
      title: props.title
    }, React.createElement('g', { transform: trans, className: props.className }, React.createElement(XAxis, {
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
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(YAxis, {
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
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), React.createElement(DataSeries, {
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
      onCloseToolTip: this.onMouseLeave
    }))), props.showTooltip ? React.createElement(Tooltip, this.state.tooltip) : null);
  }

});

},{"../common":30,"../mixins":42,"../utils":58,"./DataSeries":32}],35:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  getDefaultProps: function getDefaultProps() {
    return {
      circleRadius: 3,
      circleFill: '#1f77b4'
    };
  },

  render: function render() {
    return React.createElement('g', null, React.createElement('path', {
      onMouseOver: this.props.handleMouseOver,
      onMouseLeave: this.props.handleMouseLeave,
      fill: 'transparent',
      d: this.props.voronoiPath
    }), React.createElement('circle', {
      onMouseOver: this.props.handleMouseOver,
      onMouseLeave: this.props.handleMouseLeave,
      cx: this.props.cx,
      cy: this.props.cy,
      r: this.props.circleRadius,
      fill: this.props.circleFill,
      className: 'rd3-linechart-circle'
    }));
  }
});

},{}],36:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VornoiCircleContainer',

  getDefaultProps: function getDefaultProps() {
    return {
      circleRadius: 3,
      circleFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    };
  },

  render: function render() {

    var props = this.props;

    // animation controller
    var handleMouseOver, handleMouseLeave;
    if (props.hoverAnimation) {
      handleMouseOver = this._animateCircle;
      handleMouseLeave = this._restoreCircle;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }
    handleMouseOver = this._showToolTip;
    handleMouseLeave = this.props.closeToolTip;

    return React.createElement('g', { className: 'vcc' }, React.createElement(VoronoiCircle, {
      handleMouseOver: handleMouseOver.bind(this, this.props.dataPoint),
      handleMouseLeave: handleMouseLeave,
      voronoiPath: this._drawPath(props.vnode),
      cx: props.cx,
      cy: props.cy,
      circleRadius: this.state.circleRadius,
      circleFill: this.state.circleFill
    }));
  },

  _showToolTip: function _showToolTip(dataPoint, event) {
    console.log(event);
    var x = event.clientX,
        y = event.clientY;
    this.props.onMouseOver(x, y, dataPoint);
  },

  _animateCircle: function _animateCircle() {
    var rect = this.getDOMNode().getElementsByTagName("circle")[0].getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint);
    this.setState({
      circleRadius: this.props.circleRadius * (5 / 4),
      circleFill: shade(this.props.circleFill, 0.2)
    });
  },

  _restoreCircle: function _restoreCircle() {
    this.setState({
      circleRadius: this.props.circleRadius,
      circleFill: this.props.circleFill
    });
  },

  _drawPath: function _drawPath(d) {
    if (d === undefined) {
      return;
    }
    return 'M' + d.join(',') + 'Z';
  }
});

},{"../utils":58,"./VoronoiCircle":35}],37:[function(require,module,exports){
'use strict';

exports.LineChart = require('./LineChart');

},{"./LineChart":34}],38:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = {

  propTypes: {
    axesColor: React.PropTypes.string,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array.isRequired,
    height: React.PropTypes.number,
    horizontal: React.PropTypes.bool,
    legend: React.PropTypes.bool,
    legendOffset: React.PropTypes.number,
    title: React.PropTypes.string,
    width: React.PropTypes.number,
    xAccessor: React.PropTypes.func,
    xAxisFormatter: React.PropTypes.func,
    xAxisLabel: React.PropTypes.string,
    xAxisLabelOffset: React.PropTypes.number,
    xAxisTickCount: React.PropTypes.number,
    xAxisTickInterval: React.PropTypes.object,
    xAxisTickValues: React.PropTypes.array,
    xAxisOffset: React.PropTypes.number,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    yAccessor: React.PropTypes.func,
    yAxisFormatter: React.PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisLabelOffset: React.PropTypes.number,
    yAxisTickCount: React.PropTypes.number,
    yAxisTickInterval: React.PropTypes.object,
    yAxisTickValues: React.PropTypes.array,
    yAxisOffset: React.PropTypes.number,
    yOrient: React.PropTypes.oneOf(['default', 'left', 'right'])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      axesColor: '#000',
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      },
      height: 200,
      horizontal: false,
      legend: false,
      legendOffset: 120,
      title: '',
      width: 400,
      // xAxisFormatter: no predefined value right now
      xAxisLabel: '',
      xAxisLabelOffset: 38,
      xAxisOffset: 0,
      // xAxisTickCount: no predefined value right now
      // xAxisTickInterval: no predefined value right now
      // xAxisTickValues: no predefined value right now
      xOrient: 'bottom',
      // yAxisFormatter: no predefined value right now
      yAxisLabel: '',
      yAxisLabelOffset: 35,
      yAxisOffset: 0,
      // yAxisTickCount: no predefined value right now
      // yAxisTickInterval: no predefined value right now
      // yAxisTickValues: no predefined value right now
      yOrient: 'default'
    };
  },

  getYOrient: function getYOrient() {
    var yOrient = this.props.yOrient;

    if (yOrient === 'default') {
      return this.props.horizontal ? 'right' : 'left';
    }

    return yOrient;
  }
};

},{}],39:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = {
  propTypes: {
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      xAccessor: function xAccessor(d) {
        return d.x;
      },
      yAccessor: function yAccessor(d) {
        return d.y;
      }
    };
  }
};

},{}],40:[function(require,module,exports){
'use strict';

var React = window.React;

module.exports = {

  propTypes: {
    showTooltip: React.PropTypes.bool,
    tooltipFormat: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      showTooltip: true,
      tooltipFormat: function tooltipFormat(d) {
        return String(d.yValue);
      }
    };
  },

  getInitialState: function getInitialState() {
    return {
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      }
    };
  },

  onMouseOver: function onMouseOver(x, y, dataPoint) {
    if (!this.props.showTooltip) return;
    this.setState({
      tooltip: {
        x: x,
        y: y,
        child: this.props.tooltipFormat.call(this, dataPoint),
        show: true
      }
    });
  },

  onMouseLeave: function onMouseLeave() {
    if (!this.props.showTooltip) return;
    this.setState({
      tooltip: {
        x: 0,
        y: 0,
        child: '',
        show: false
      }
    });
  }
};

},{}],41:[function(require,module,exports){

'use strict';

var React = window.React;

module.exports = {

  propTypes: {
    viewBox: React.PropTypes.string,
    viewBoxObject: React.PropTypes.object
  },

  getViewBox: function getViewBox() {
    if (this.props.viewBoxObject) {
      var v = this.props.viewBoxObject;
      return [v.x, v.y, v.width, v.height].join(' ');
    } else if (this.props.viewBox) {
      return this.props.viewBox;
    }
  },

  getDimensions: function getDimensions() {
    var props = this.props;
    var horizontal = props.horizontal;
    var margins = props.margins;
    var viewBoxObject = props.viewBoxObject;
    var xOrient = props.xOrient;
    var xAxisOffset = props.xAxisOffset;
    var yAxisOffset = props.yAxisOffset;

    var yOrient = this.getYOrient();

    var width, height;
    if (viewBoxObject) {
      width = viewBoxObject.width, height = viewBoxObject.height;
    } else {
      width = props.width, height = props.height;
    }

    var svgWidth, svgHeight;
    var xOffset, yOffset;
    var svgMargins;
    var trans;
    if (horizontal) {
      var center = width / 2;
      trans = 'rotate(90 ' + center + ' ' + center + ') ';
      svgWidth = height;
      svgHeight = width;
      svgMargins = {
        left: margins.top,
        top: margins.right,
        right: margins.bottom,
        bottom: margins.left
      };
    } else {
      trans = '';
      svgWidth = width;
      svgHeight = height;
      svgMargins = margins;
    }

    var xAxisOffset = Math.abs(props.xAxisOffset || 0);
    var yAxisOffset = Math.abs(props.yAxisOffset || 0);

    var xOffset = svgMargins.left + (yOrient === 'left' ? yAxisOffset : 0);
    var yOffset = svgMargins.top + (xOrient === 'top' ? xAxisOffset : 0);
    trans += 'translate(' + xOffset + ', ' + yOffset + ')';

    return {
      innerHeight: svgHeight - svgMargins.top - svgMargins.bottom - xAxisOffset,
      innerWidth: svgWidth - svgMargins.left - svgMargins.right - yAxisOffset,
      trans: trans,
      svgMargins: svgMargins
    };
  }

};

},{}],42:[function(require,module,exports){
'use strict';

exports.CartesianChartPropsMixin = require('./CartesianChartPropsMixin');
exports.DefaultAccessorsMixin = require('./DefaultAccessorsMixin');
exports.ViewBoxMixin = require('./ViewBoxMixin');
exports.TooltipMixin = require('./TooltipMixin');

},{"./CartesianChartPropsMixin":38,"./DefaultAccessorsMixin":39,"./TooltipMixin":40,"./ViewBoxMixin":41}],43:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'Arc',

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string,
    sectorBorderColor: React.PropTypes.string,
    showInnerLabels: React.PropTypes.bool,
    showOuterLabels: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      labelTextFill: 'black',
      valueTextFill: 'white',
      showInnerLabels: true,
      showOuterLabels: true
    };
  },

  render: function render() {
    var props = this.props;

    var arc = d3.svg.arc().innerRadius(props.innerRadius).outerRadius(props.outerRadius).startAngle(props.startAngle).endAngle(props.endAngle);

    return React.createElement('g', { className: 'rd3-piechart-arc' }, React.createElement('path', {
      d: arc(),
      fill: props.fill,
      stroke: props.sectorBorderColor,
      onMouseOver: props.handleMouseOver,
      onMouseLeave: props.handleMouseLeave
    }), props.showOuterLabels ? this.renderOuterLabel(props, arc) : null, props.showInnerLabels ? this.renderInnerLabel(props, arc) : null);
  },

  renderInnerLabel: function renderInnerLabel(props, arc) {
    // make value text can be formatted
    var formattedValue = props.valueTextFormatter(props.value);
    return React.createElement('text', {
      className: 'rd3-piechart-value',
      transform: 'translate(' + arc.centroid() + ')',
      dy: '.35em',
      style: {
        'shapeRendering': 'crispEdges',
        'textAnchor': 'middle',
        'fill': props.valueTextFill
      } }, formattedValue);
  },

  renderOuterLabel: function renderOuterLabel(props, arc) {

    var rotate = 'rotate(' + (props.startAngle + props.endAngle) / 2 * (180 / Math.PI) + ')';
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist = radius + 35;
    var angle = (props.startAngle + props.endAngle) / 2;
    var x = dist * (1.2 * Math.sin(angle));
    var y = -dist * Math.cos(angle);
    var t = 'translate(' + x + ',' + y + ')';

    return React.createElement('g', null, React.createElement('line', {
      x1: '0',
      x2: '0',
      y1: -radius - 2,
      y2: -radius - 26,
      stroke: props.labelTextFill,
      transform: rotate,
      style: {
        'fill': props.labelTextFill,
        'strokeWidth': 2
      }
    }), React.createElement('text', {
      className: 'rd3-piechart-label',
      transform: t,
      dy: '.35em',
      style: {
        'textAnchor': 'middle',
        'fill': props.labelTextFill,
        'shapeRendering': 'crispEdges'
      } }, props.label));
  }
});

},{}],44:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var shade = require('../utils').shade;
var Arc = require('./Arc');

module.exports = React.createClass({

  displayName: 'ArcContainer',

  propTypes: {
    fill: React.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill
    };
  },

  render: function render() {

    var props = this.props;

    return React.createElement(Arc, _extends({}, this.props, {
      fill: this.state.fill,
      handleMouseOver: props.hoverAnimation ? this._animateArc : null,
      handleMouseLeave: props.hoverAnimation ? this._restoreArc : null
    }));
  },

  _animateArc: function _animateArc() {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint);
    this.setState({
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreArc: function _restoreArc() {
    this.props.onMouseLeave.call(this);
    this.setState({
      fill: this.props.fill
    });
  }
});

},{"../utils":58,"./Arc":43}],45:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var ArcContainer = require('./ArcContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    values: React.PropTypes.array,
    labels: React.PropTypes.array,
    transform: React.PropTypes.string,
    innerRadius: React.PropTypes.number,
    radius: React.PropTypes.number,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    showInnerLabels: React.PropTypes.bool,
    showOuterLabels: React.PropTypes.bool,
    sectorBorderColor: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      innerRadius: 0,
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      }
    };
  },

  render: function render() {

    var props = this.props;

    var pie = d3.layout.pie().sort(null);

    var arcData = pie(props.values);

    var arcs = arcData.map(function (arc, idx) {
      return React.createElement(ArcContainer, {
        key: idx,
        startAngle: arc.startAngle,
        endAngle: arc.endAngle,
        outerRadius: props.radius,
        innerRadius: props.innerRadius,
        labelTextFill: props.labelTextFill,
        valueTextFill: props.valueTextFill,
        valueTextFormatter: props.valueTextFormatter,
        fill: props.colors(props.colorAccessor(props.data[idx], idx)),
        value: props.values[idx],
        label: props.labels[idx],
        width: props.width,
        showInnerLabels: props.showInnerLabels,
        showOuterLabels: props.showOuterLabels,
        sectorBorderColor: props.sectorBorderColor,
        hoverAnimation: props.hoverAnimation,
        onMouseOver: props.onMouseOver,
        onMouseLeave: props.onMouseLeave,
        dataPoint: { yValue: props.values[idx], seriesName: props.labels[idx] }
      });
    });
    return React.createElement('g', { className: 'rd3-piechart-pie', transform: props.transform }, arcs);
  }
});

},{"./ArcContainer":44}],46:[function(require,module,exports){
'use strict';

var d3 = window.d3;
var React = window.React;
var DataSeries = require('./DataSeries');

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;
var Tooltip = _require.Tooltip;

var TooltipMixin = require('../mixins').TooltipMixin;

module.exports = React.createClass({

  mixins: [TooltipMixin],

  displayName: 'PieChart',

  propTypes: {
    data: React.PropTypes.array,
    radius: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string,
    valueTextFormatter: React.PropTypes.func,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    title: React.PropTypes.string,
    showInnerLabels: React.PropTypes.bool,
    showOuterLabels: React.PropTypes.bool,
    sectorBorderColor: React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      title: '',
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      },
      valueTextFormatter: function valueTextFormatter(val) {
        return val + '%';
      },
      hoverAnimation: true
    };
  },

  render: function render() {
    var props = this.props;

    var transform = 'translate(' + (props.cx || props.width / 2) + ',' + (props.cy || props.height / 2) + ')';

    var values = props.data.map(function (item) {
      return item.value;
    });
    var labels = props.data.map(function (item) {
      return item.label;
    });

    return React.createElement('span', null, React.createElement(Chart, {
      width: props.width,
      height: props.height,
      title: props.title
    }, React.createElement('g', { className: 'rd3-piechart' }, React.createElement(DataSeries, {
      labelTextFill: props.labelTextFill,
      valueTextFill: props.valueTextFill,
      valueTextFormatter: props.valueTextFormatter,
      data: props.data,
      values: values,
      labels: labels,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      transform: transform,
      width: props.width,
      height: props.height,
      radius: props.radius,
      innerRadius: props.innerRadius,
      showInnerLabels: props.showInnerLabels,
      showOuterLabels: props.showOuterLabels,
      sectorBorderColor: props.sectorBorderColor,
      hoverAnimation: props.hoverAnimation,
      onMouseOver: this.onMouseOver,
      onMouseLeave: this.onMouseLeave
    }))), props.showTooltip ? React.createElement(Tooltip, this.state.tooltip) : null);
  }

});

},{"../common":30,"../mixins":42,"./DataSeries":45}],47:[function(require,module,exports){
'use strict';

exports.PieChart = require('./PieChart');

},{"./PieChart":46}],48:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var VoronoiCircleContainer = require('./VoronoiCircleContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    circleRadius: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    colors: React.PropTypes.func.isRequired,
    colorAccessor: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    height: React.PropTypes.number.isRequired,
    xAccessor: React.PropTypes.func.isRequired,
    xScale: React.PropTypes.func.isRequired,
    yAccessor: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-scatterchart-dataseries'
    };
  },

  render: function render() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    var xAccessor = props.xAccessor;
    var yAccessor = props.yAccessor;

    var voronoi = d3.geom.voronoi().x(function (d) {
      return xScale(d.coord.x);
    }).y(function (d) {
      return yScale(d.coord.y);
    }).clipExtent([[0, 0], [props.width, props.height]]);

    var regions = voronoi(props.data).map(function (vnode, idx) {
      var point = vnode.point;
      var coord = point.coord;

      var x = xAccessor(coord);
      var y = yAccessor(coord);

      // The circle coordinates
      var cx, cy;

      if (Object.prototype.toString.call(x) === '[object Date]') {
        cx = xScale(x.getTime());
      } else {
        cx = xScale(x);
      }

      if (Object.prototype.toString.call(y) === '[object Date]') {
        cy = yScale(y.getTime());
      } else {
        cy = yScale(y);
      }

      return React.createElement(VoronoiCircleContainer, {
        key: idx,
        circleFill: props.colors(props.colorAccessor(point.d, point.seriesIndex)),
        circleRadius: props.circleRadius,
        cx: cx,
        cy: cy,
        vnode: vnode,
        onMouseOver: props.onMouseOver,
        dataPoint: { xValue: x, yValue: y, seriesName: point.series.name }
      });
    });

    return React.createElement('g', {
      className: props.className
    }, regions);
  }

});

},{"./VoronoiCircleContainer":51}],49:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

var _require = require('../common');

var Chart = _require.Chart;
var XAxis = _require.XAxis;
var YAxis = _require.YAxis;
var Tooltip = _require.Tooltip;

var DataSeries = require('./DataSeries');
var utils = require('../utils');

var _require2 = require('../mixins');

var CartesianChartPropsMixin = _require2.CartesianChartPropsMixin;
var DefaultAccessorsMixin = _require2.DefaultAccessorsMixin;
var ViewBoxMixin = _require2.ViewBoxMixin;
var TooltipMixin = _require2.TooltipMixin;

module.exports = React.createClass({

  mixins: [CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin],

  displayName: 'ScatterChart',

  propTypes: {
    circleRadius: React.PropTypes.number,
    className: React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool,
    margins: React.PropTypes.object,
    xAxisClassName: React.PropTypes.string,
    xAxisStrokeWidth: React.PropTypes.number,
    yAxisClassName: React.PropTypes.string,
    yAxisStrokeWidth: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      circleRadius: 3,
      className: 'rd3-scatterchart',
      hoverAnimation: true,
      margins: { top: 10, right: 20, bottom: 50, left: 45 },
      xAxisClassName: 'rd3-scatterchart-xaxis',
      xAxisStrokeWidth: 1,
      yAxisClassName: 'rd3-scatterchart-yaxis',
      yAxisStrokeWidth: 1
    };
  },

  _calculateScales: utils.calculateScales,

  render: function render() {

    var props = this.props;
    var data = props.data;

    if (!data || data.length < 1) {
      return null;
    }

    var _getDimensions = this.getDimensions();

    var innerWidth = _getDimensions.innerWidth;
    var innerHeight = _getDimensions.innerHeight;
    var trans = _getDimensions.trans;
    var svgMargins = _getDimensions.svgMargins;

    var yOrient = this.getYOrient();

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues);
    var xScale = scales.xScale;
    var yScale = scales.yScale;

    return React.createElement('span', { onMouseLeave: this.onMouseLeave }, React.createElement(Chart, {
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      data: data,
      height: props.height,
      legend: props.legend,
      margins: props.margins,
      title: props.title,
      viewBox: this.getViewBox(),
      width: props.width
    }, React.createElement('g', {
      className: props.className,
      transform: trans
    }, React.createElement(XAxis, {
      data: data,
      height: innerHeight,
      horizontalChart: props.horizontal,
      margins: svgMargins,
      stroke: props.axesColor,
      strokeWidth: props.xAxisStrokeWidth.toString(),
      tickFormatting: props.xAxisFormatter,
      width: innerWidth,
      xAxisClassName: props.xAxisClassName,
      xAxisLabel: props.xAxisLabel,
      xAxisLabelOffset: props.xAxisLabelOffset,
      xAxisOffset: props.xAxisOffset,
      xAxisTickInterval: props.xAxisTickInterval,
      xAxisTickValues: props.xAxisTickValues,
      xOrient: props.xOrient,
      yOrient: yOrient,
      xScale: xScale,
      gridVertical: props.gridVertical,
      gridVerticalStroke: props.gridVerticalStroke,
      gridVerticalStrokeWidth: props.gridVerticalStrokeWidth,
      gridVerticalStrokeDash: props.gridVerticalStrokeDash
    }), React.createElement(YAxis, {
      data: data,
      width: innerWidth,
      height: innerHeight,
      horizontalChart: props.horizontal,
      margins: svgMargins,
      stroke: props.axesColor,
      strokeWidth: props.yAxisStrokeWidth.toString(),
      tickFormatting: props.yAxisFormatter,
      yAxisClassName: props.yAxisClassName,
      yAxisLabel: props.yAxisLabel,
      yAxisLabelOffset: props.yAxisLabelOffset,
      yAxisOffset: props.yAxisOffset,
      yAxisTickValues: props.yAxisTickValues,
      yAxisTickCount: props.yAxisTickCount,
      yScale: yScale,
      xOrient: props.xOrient,
      yOrient: yOrient,
      gridHorizontal: props.gridHorizontal,
      gridHorizontalStroke: props.gridHorizontalStroke,
      gridHorizontalStrokeWidth: props.gridHorizontalStrokeWidth,
      gridHorizontalStrokeDash: props.gridHorizontalStrokeDash
    }), React.createElement(DataSeries, {
      circleRadius: props.circleRadius,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      data: allValues,
      height: innerHeight,
      hoverAnimation: props.hoverAnimation,
      width: innerWidth,
      xAccessor: props.xAccessor,
      xScale: xScale,
      yAccessor: props.yAccessor,
      yScale: yScale,
      onMouseOver: this.onMouseOver
    }))), props.showTooltip ? React.createElement(Tooltip, this.state.tooltip) : null);
  }

});

},{"../common":30,"../mixins":42,"../utils":58,"./DataSeries":48}],50:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'VoronoiCircle',

  propTypes: {
    circleFill: React.PropTypes.string.isRequired,
    circleRadius: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    cx: React.PropTypes.number.isRequired,
    cy: React.PropTypes.number.isRequired,
    handleMouseLeave: React.PropTypes.func.isRequired,
    handleMouseOver: React.PropTypes.func.isRequired,
    pathFill: React.PropTypes.string,
    voronoiPath: React.PropTypes.string.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'rd3-scatterchart-voronoi-circle',
      pathFill: 'transparent'
    };
  },

  render: function render() {
    var props = this.props;

    return React.createElement('g', null, React.createElement('path', {
      d: props.voronoiPath,
      fill: props.pathFill,
      onMouseLeave: props.handleMouseLeave,
      onMouseOver: props.handleMouseOver
    }), React.createElement('circle', {
      cx: props.cx,
      cy: props.cy,
      className: props.className,
      fill: props.circleFill,
      onMouseLeave: props.handleMouseLeave,
      onMouseOver: props.handleMouseOver,
      r: props.circleRadius
    }));
  }
});

},{}],51:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');

module.exports = React.createClass({

  displayName: 'VornoiCircleContainer',

  propTypes: {
    circleFill: React.PropTypes.string,
    circleRadius: React.PropTypes.number,
    circleRadiusMultiplier: React.PropTypes.number,
    className: React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool,
    shadeMultiplier: React.PropTypes.number,
    vnode: React.PropTypes.array.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      circleFill: '#1f77b4',
      circleRadius: 3,
      circleRadiusMultiplier: 1.25,
      className: 'rd3-scatterchart-voronoi-circle-container',
      hoverAnimation: true,
      shadeMultiplier: 0.2
    };
  },

  getInitialState: function getInitialState() {
    return {
      circleFill: this.props.circleFill,
      circleRadius: this.props.circleRadius
    };
  },

  render: function render() {

    var props = this.props;
    var state = this.state;

    return React.createElement('g', {
      className: props.className
    }, React.createElement(VoronoiCircle, {
      circleFill: state.circleFill,
      circleRadius: state.circleRadius,
      cx: props.cx,
      cy: props.cy,
      handleMouseLeave: this._restoreCircle,
      handleMouseOver: this._animateCircle,
      voronoiPath: this._drawPath(props.vnode)
    }));
  },

  _animateCircle: function _animateCircle() {
    var props = this.props;

    if (props.hoverAnimation) {
      var rect = this.getDOMNode().getElementsByTagName("circle")[0].getBoundingClientRect();
      this.props.onMouseOver.call(this, rect.right, rect.top, props.dataPoint);
      this.setState({
        circleFill: shade(props.circleFill, props.shadeMultiplier),
        circleRadius: props.circleRadius * props.circleRadiusMultiplier
      });
    }
  },

  _restoreCircle: function _restoreCircle() {
    var props = this.props;
    if (props.hoverAnimation) {
      this.setState({
        circleFill: props.circleFill,
        circleRadius: props.circleRadius
      });
    }
  },

  _drawPath: function _drawPath(d) {
    if (typeof d === 'undefined') {
      return 'M Z';
    }

    return 'M' + d.join(',') + 'Z';
  }
});

},{"../utils":58,"./VoronoiCircle":50}],52:[function(require,module,exports){
'use strict';

exports.ScatterChart = require('./ScatterChart');

},{"./ScatterChart":49}],53:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;

module.exports = React.createClass({

  displayName: 'Cell',

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    label: React.PropTypes.string
  },

  render: function render() {

    var props = this.props;

    var textStyle = {
      'textAnchor': 'middle',
      'fill': props.textColor,
      'fontSize': props.fontSize
    };

    var t = 'translate(' + props.x + ', ' + props.y + '  )';

    return React.createElement('g', { transform: t }, React.createElement('rect', {
      className: 'rd3-treemap-cell',
      width: props.width,
      height: props.height,
      fill: props.fill,
      onMouseOver: props.handleMouseOver,
      onMouseLeave: props.handleMouseLeave
    }), React.createElement('text', {
      x: props.width / 2,
      y: props.height / 2,
      dy: '.35em',
      style: textStyle,
      className: 'rd3-treemap-cell-text'
    }, props.label));
  }
});

},{}],54:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var React = window.React;
var shade = require('../utils').shade;
var Cell = require('./Cell');

module.exports = React.createClass({

  displayName: 'CellContainer',

  propTypes: {
    fill: React.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill
    };
  },

  render: function render() {

    var props = this.props;

    return React.createElement(Cell, _extends({}, props, {
      fill: this.state.fill,
      handleMouseOver: props.hoverAnimation ? this._animateCell : null,
      handleMouseLeave: props.hoverAnimation ? this._restoreCell : null
    }));
  },

  _animateCell: function _animateCell() {
    this.setState({
      fill: shade(this.props.fill, 0.05)
    });
  },

  _restoreCell: function _restoreCell() {
    this.setState({
      fill: this.props.fill
    });
  }
});

},{"../utils":58,"./Cell":53}],55:[function(require,module,exports){
'use strict';

var React = window.React;
var d3 = window.d3;
var CellContainer = require('./CellContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      }
    };
  },

  render: function render() {

    var props = this.props;

    var treemap = d3.layout.treemap()
    // make sure calculation loop through all objects inside array
    .children(function (d) {
      return d;
    }).size([props.width, props.height]).sticky(true).value(function (d) {
      return d.value;
    });

    var tree = treemap(props.data);

    var cells = tree.map(function (node, idx) {
      return React.createElement(CellContainer, {
        key: idx,
        x: node.x,
        y: node.y,
        width: node.dx,
        height: node.dy,
        fill: props.colors(props.colorAccessor(node, idx)),
        label: node.label,
        fontSize: props.fontSize,
        textColor: props.textColor,
        hoverAnimation: props.hoverAnimation
      });
    }, this);

    return React.createElement('g', { transform: props.transform, className: 'treemap' }, cells);
  }

});

},{"./CellContainer":54}],56:[function(require,module,exports){
'use strict';

var d3 = window.d3;
var React = window.React;
var Chart = require('../common').Chart;
var DataSeries = require('./DataSeries');

module.exports = React.createClass({

  displayName: 'Treemap',

  propTypes: {
    data: React.PropTypes.array,
    margins: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontSize: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    colors: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      hoverAnimation: true,
      data: [],
      width: 400,
      heigth: 200,
      title: '',
      textColor: '#f7f7f7',
      fontSize: '0.85em',
      colors: d3.scale.category20c(),
      colorAccessor: function colorAccessor(d, idx) {
        return idx;
      }
    };
  },

  render: function render() {

    var props = this.props;

    return React.createElement(Chart, {
      title: props.title,
      width: props.width,
      height: props.height
    }, React.createElement('g', { className: 'rd3-treemap' }, React.createElement(DataSeries, {
      data: props.data,
      width: props.width,
      height: props.height,
      colors: props.colors,
      colorAccessor: props.colorAccessor,
      textColor: props.textColor,
      fontSize: props.fontSize,
      hoverAnimation: props.hoverAnimation
    })));
  }

});

},{"../common":30,"./DataSeries":55}],57:[function(require,module,exports){
'use strict';

exports.Treemap = require('./Treemap');

},{"./Treemap":56}],58:[function(require,module,exports){
'use strict';

var d3 = window.d3;

exports.calculateScales = function (chartWidth, chartHeight, xValues, yValues) {

  var xScale, yScale;

  if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]') {
    xScale = d3.time.scale().range([0, chartWidth]);
  } else {
    xScale = d3.scale.linear().range([0, chartWidth]);
  }
  xScale.domain(d3.extent(xValues));

  if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object Date]') {
    yScale = d3.time.scale().range([chartHeight, 0]);
  } else {
    yScale = d3.scale.linear().range([chartHeight, 0]);
  }

  console.log(d3.extent(yValues));
  yScale.domain(d3.extent(yValues)).nice();

  return {
    xScale: xScale,
    yScale: yScale
  };
};

// debounce from Underscore.js
// MIT License: https://raw.githubusercontent.com/jashkenas/underscore/master/LICENSE
// Copyright (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative
// Reporters & Editors
exports.debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

exports.flattenData = function (data, xAccessor, yAccessor) {

  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  data.forEach(function (series, i) {
    series.values.forEach(function (item, j) {

      var x = xAccessor(item);

      // Check for NaN since d3's Voronoi cannot handle NaN values
      // Go ahead and Proceed to next iteration since we don't want NaN
      // in allValues or in xValues or yValues
      if (isNaN(x)) {
        return;
      }
      xValues.push(x);

      var y = yAccessor(item);
      // when yAccessor returns an object (as in the case of candlestick)
      // iterate over the keys and push all the values to yValues array
      var yNode;
      if (typeof y === 'object' && Object.keys(y).length > 0) {
        Object.keys(y).forEach(function (key) {
          // Check for NaN since d3's Voronoi cannot handle NaN values
          // Go ahead and Proceed to next iteration since we don't want NaN
          // in allValues or in xValues or yValues
          if (isNaN(y[key])) {
            return;
          }
          yValues.push(y[key]);
          // if multiple y points are to be plotted for a single x
          // as in the case of candlestick, default to y value of 0
          yNode = 0;
        });
      } else {
        // Check for NaN since d3's Voronoi cannot handle NaN values
        // Go ahead and Proceed to next iteration since we don't want NaN
        // in allValues or in xValues or yValues
        if (isNaN(y)) {
          return;
        }
        yValues.push(y);
        yNode = y;
      }

      var xyCoords = x + '-' + yNode;
      if (coincidentCoordinateCheck.hasOwnProperty(xyCoords)) {
        // Proceed to next iteration if the x y pair already exists
        // d3's Voronoi cannot handle NaN values or coincident coords
        // But we push them into xValues and yValues above because
        // we still may handle them there (labels, etc.)
        return;
      }
      coincidentCoordinateCheck[xyCoords] = '';

      var pointItem = {
        coord: {
          x: x,
          y: yNode
        },
        d: item,
        id: series.name + j,
        series: series,
        seriesIndex: i
      };
      allValues.push(pointItem);
    });
  });

  return {
    allValues: allValues,
    xValues: xValues,
    yValues: yValues
  };
};

exports.shade = function (hex, percent) {

  var R, G, B, red, green, blue, number;
  var min = Math.min,
      round = Math.round;
  if (hex.length !== 7) {
    return hex;
  }
  number = parseInt(hex.slice(1), 16);
  R = number >> 16;
  G = number >> 8 & 0xFF;
  B = number & 0xFF;
  red = min(255, round((1 + percent) * R)).toString(16);
  if (red.length === 1) red = '0' + red;
  green = min(255, round((1 + percent) * G)).toString(16);
  if (green.length === 1) green = '0' + green;
  blue = min(255, round((1 + percent) * B)).toString(16);
  if (blue.length === 1) blue = '0' + blue;
  return '#' + red + green + blue;
};

},{}]},{},[31])(31)
});
//# sourceMappingURL=react-d3.js.map
