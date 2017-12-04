import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, POINT } from '../../../Interfaces';
import { convertedTime, calculateMiddlePoint, unifyTwoPeriod, transformYear } from  '../../../api';
import * as SizeTrack from '../SizeTrack';

import './LineChart.css';

interface Props {
  name: string;
  title: string;
  title2?: string;
  value: POINT[];
  value2?: POINT[];
  range: [number, number];
  predict?: boolean;
  isGrid: boolean;
  isNormal1: boolean;
  isNormal2: boolean;
  normalRange1?: [number, number];
  normalRange2?: [number, number];
  isShade1: boolean;
  isShade2: boolean;
  unit: string;
  color: string;
  color2?: string;
  position: number;
  patient?: PATIENT;
  zoom?: [number, number];
  value3?: POINT[];
  value4?: POINT[];
  color3?: string;
  color4?: string;
  secondTimeRange?: any;
}

interface States {

}

const mapStateToProps = (state: ROOTSTATE, ownProps: Props) => ({
    patient: state.patient,
    zoom: state.zoom
});
const mapDispatchToProps = (dispatch: any) => ({ });
const mergeProps = (stateProps: ROOTSTATE, dispatchProps: any, ownProps: Props) => ({
    ...ownProps,
    patient: stateProps.patient,
    zoom: stateProps.zoom
});
  
class LineChart extends React.Component<any, States> {
  focus: any = null;
  start: any = null;
  end: any = null;
  isGetTime: boolean = false;
  value: any;
  value2: any;
  value3: any;
  value4: any;

  constructor() {
    super();
  }

  drawMark(chart: any, x: any, y: any, selectDate: any, displayValue: any, textMove: any, color: any) {
    var markGroup = chart.append('g').attr('class', 'mark-group');

    var markBg = markGroup.append('rect')
        .attr('class', 'mark-bg')
        .attr('fill', color)
        .attr('height', '20px')
        .attr('x', x(selectDate) + textMove - 5)
        .attr('y', y(displayValue) - 30)
        .attr('rx', '5')
        .attr('ry', '5')
        .attr('transform', 'translate(-10,0)');

    var markText = markGroup.append('text')
        .attr('class', 'text-mark')
        .attr('fill', 'white')
        .text(displayValue)
        .attr('x', x(selectDate) + textMove)
        .attr('y', y(displayValue) - 15)
        .attr('font-size', 12)
        .attr('transform', 'translate(-10,0)');

    markBg.attr('width', (markText as any).node().getComputedTextLength() + 12);

    markGroup.append('rect')
        .attr('class', 'mark')
        .attr('fill', color)
        .attr('x', x(selectDate) + 5)
        .attr('y', y(displayValue) - 5)
        .attr('rx', '100')
        .attr('ry', '100')
        .attr('width', '10px')
        .attr('height', '10px')
        .attr('transform', 'translate(-10,0)');
  }

  drawNormalRange(chart: any, isNormal1: boolean, isNormal2: boolean, 
                  normalRange1: [number, number], normalRange2: [number, number],
                  color: string, color2: string, y: any) {
    if (isNormal1) {
        chart.append('rect')
            .attr('class', 'normal-range')
            .attr('fill', color)
            .attr('opacity', 0.3)
            .attr('x', 0)
            .attr('width', '750px')
            .attr('y', y(Number(normalRange1[1])))
            .attr('height',  -y(Number(normalRange1[1])) + y(Number(normalRange1[0])))
            .attr('transform', 'translate(-10,0)');
    }

    if (isNormal2) {
        chart.append('rect')
            .attr('class', 'normal-range')
            .attr('fill', color2)
            .attr('opacity', 0.3)
            .attr('x', 0)
            .attr('width', '750px')
            .attr('y', y(Number(normalRange2[1])))
            .attr('height',  -y(Number(normalRange2[1])) + y(Number(normalRange2[0])))
            .attr('transform', 'translate(-10,0)');
    }
  }

  drawGrid(svg: any, margin: any, width: number, y: any, isGrid: boolean) {
    if (isGrid) {
        svg.append('g')
            .attr('class', 'y-grid')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(d3.axisLeft(y).ticks(5, 's').tickSize(-width).tickFormat(null));
    } else {
         svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(d3.axisLeft(y).ticks(5, 's').tickSizeOuter(0));
    }
     
  }

  drawPoint(chart: any, data: Object[], data2: Object[], color: string, color2: string, x: any, y: any) {
    chart.selectAll('.point')
    .data(data)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill', color)
      .attr('rx', '100')
      .attr('ry', '100')
      .attr('x', function(d: any) { return x(Number(convertedTime(d.time))) + 7; })
      .attr('width', '7px')
      .attr('y', function(d: any) { return y(Number(d.value)) - 3.5; })
      .attr('height', '7px')
      .attr('transform', 'translate(-10,0)');
    
    if (data2) {
        chart.selectAll('.point-2')
          .data(data2)
          .enter().append('rect')
            .attr('class', 'bar')
            .attr('fill', color2)
            .attr('rx', '100')
            .attr('ry', '100')
            .attr('x', function(d: any) { return x(Number(convertedTime(d.time))) + 7; })
            .attr('width', '7px')
            .attr('y', function(d: any) { return y(Number(d.value)) - 3.5; })
            .attr('height', '7px')
            .attr('transform', 'translate(-10,0)');
    }
  }

  drawSelector(chart: any, color: string, color2: string, data2: Object[], data3: Object[], data4: Object[],
               color3: string, color4: string) {
    chart.append('rect')
        .attr('class', 'selector-bg')
        .attr('fill', 'transparent')
        .attr('rx', '5')
        .attr('ry', '5')
        .attr('height', '20px')
        .attr('transform', 'translate(-10,0)');

    chart.append('text')
        .attr('class', 'text-selector')
        .attr('fill', 'black')
        .text('')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('transform', 'translate(-10,0)');

    chart.append('rect')
        .attr('class', 'selector')
        .attr('fill', 'white')
        .attr('rx', '100')
        .attr('ry', '100')
        .attr('x', '0px')
        .attr('width', '10px')
        .attr('y', 0)
        .attr('height', '10px')
        .attr('transform', 'translate(-10,0)');

    if (data2) {
      chart.append('rect')
        .attr('class', 'selector-bg-2')
        .attr('fill', 'transparent')
        .attr('rx', '5')
        .attr('ry', '5')
        .attr('height', '20px')
        .attr('transform', 'translate(-10,0)');

      chart.append('text')
          .attr('class', 'text-selector-2')
          .attr('fill', color)
          .text('')
          .attr('x', 0)
          .attr('y', 0)
          .attr('font-size', 12)
          .attr('transform', 'translate(-10,0)');

      chart.append('rect')
          .attr('class', 'selector-2')
          .attr('fill', 'transparent')
          .attr('rx', '100')
          .attr('ry', '100')
          .attr('x', '0px')
          .attr('width', '10px')
          .attr('y', 0)
          .attr('height', '10px')
          .attr('transform', 'translate(-10,0)');

    }

    if (data3) {
      chart.append('rect')
          .attr('class', 'selector-bg-3')
          .attr('fill', 'transparent')
          .attr('rx', '5')
          .attr('ry', '5')
          .attr('height', '20px')
          .attr('transform', 'translate(-10,0)');

      chart.append('text')
          .attr('class', 'text-selector-3')
          .attr('fill', color3)
          .text('')
          .attr('x', 0)
          .attr('y', 0)
          .attr('font-size', 12)
          .attr('transform', 'translate(-10,0)');

      chart.append('rect')
          .attr('class', 'selector-3')
          .attr('fill', 'transparent')
          .attr('rx', '100')
          .attr('ry', '100')
          .attr('x', '0px')
          .attr('width', '10px')
          .attr('y', 0)
          .attr('height', '10px')
          .attr('transform', 'translate(-10,0)');
    }

    if (data4) {
      chart.append('rect')
      .attr('class', 'selector-bg-4')
          .attr('fill', 'transparent')
          .attr('rx', '5')
          .attr('ry', '5')
          .attr('height', '20px')
          .attr('transform', 'translate(-10,0)');

      chart.append('text')
          .attr('class', 'text-selector-4')
          .attr('fill', color4)
          .text('')
          .attr('x', 0)
          .attr('y', 0)
          .attr('font-size', 12)
          .attr('transform', 'translate(-10,0)');

      chart.append('rect')
          .attr('class', 'selector-4')
          .attr('fill', 'transparent')
          .attr('rx', '100')
          .attr('ry', '100')
          .attr('x', '0px')
          .attr('width', '10px')
          .attr('y', 0)
          .attr('height', '10px')
          .attr('transform', 'translate(-10,0)');
    }
  }

  drawPredict(chart: any, height: number, predict: Number[]|null = null, x: any) {
    var predictY = d3.scaleLinear().range([height, 0]);
    predictY.domain([0, 1]);

    chart.selectAll('.predict')
        .data(predict)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('fill', 'green')
        .attr('x', function(d: any) { return x(Number(convertedTime(d))); })
        .attr('width', '1px')
        .attr('y', function(d: any) { return predictY(0.98); })
        .attr('height', '100px')
        .attr('transform', 'translate(-10,0)');
  }

  drawShade(svg: any, chart: any, data: any, normalRange: any, x: any, y: any, height: any, name: string) {
    var defs = svg.append('defs');
    var linearGradient = defs.append('linearGradient')
      .attr('id', 'animate-gradient-' + name)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0')
      .attr('spreadMethod', 'reflect');
    
    var colours: any = [];
    for (let i in data) {
      if (Number((data[i] as any).value) > normalRange[1]) {
        colours.push('#fd0b00');
      } else {
        colours.push('#fded00');
      }
    }
    
    linearGradient.selectAll('.stop')
      .data(colours)
      .enter().append('stop')
      .attr('offset', function(d: any, i: any) { 
        // console.log(x(Number(convertedTime((data[i] as any).time))) / 740)
        // console.log(i/(colours.length-1))
        return x(Number(convertedTime((data[i] as any).time))) / 740; 
      })   
      .attr('stop-color', function(d: any) { return d; });

    var area = d3.area()
        .x(function(d: any) { return x(Number(convertedTime(d.time))); })
        .y0(height)
        .y1(function(d: any) {  return y(Number(d.value)); });

    chart.append('path')
        .data([data])
        .attr('class', 'area')
        .attr('d', area)
        .style('fill', 'url(#animate-gradient-' + name + ')');
  }

  drawChart(data: Object[], data2: Object[], range: [number, number], 
            timeRange: [number, number], color: string, color2: string, 
            predict: Number[]|null = null, isPredict: any, name: string, 
            isGrid: boolean, isNormal1: boolean, isNormal2: boolean,
            normalRange1: [number, number],  normalRange2: [number, number],
            data3: Object[], data4: Object[], color3: string, color4: string,
            isShade1: boolean, isShade2: boolean) {
    var self = this;

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
    height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    x.domain([timeRange[0], timeRange[1]]);
    y.domain(range);

    // define the line
    var valueline = d3.line()
        .x(function(d: any) { return x(Number(convertedTime(d.time))); })
        .y(function(d: any) { return y(Number(d.value)); });
                  
    var svg = d3.select('#' + name).append('svg')
        .attr('class', 'line-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
        
    this.drawGrid(svg, margin, width, y, isGrid);  

    var chart = svg.append('g')
            .attr('clip-path', 'url(#clipPath-' + self.props.name + ')')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.drawNormalRange(chart, isNormal1, isNormal2, normalRange1, normalRange2, color, color2, y);   
    
    chart.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color)
        .attr('stroke-width', '3px')
        .attr('fill', 'none');

    if (isShade1) {
      this.drawShade(svg, chart, data, normalRange1, x, y, height, name);
    }
    
    if (data2) {
      chart.append('path')
        .data([data2])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color2)
        .attr('stroke-width', '3px')
        .attr('fill', 'none');
      
      if (isShade2) {
        this.drawShade(svg, chart, data2, normalRange2, x, y, height, name);
      }
    }

    if (data3) {
      chart.append('path')
        .data([data3])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color3)
        .attr('stroke-width', '3px')
        .attr('fill', 'none');
    }

    if (data4) {
      chart.append('path')
        .data([data4])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color4)
        .attr('stroke-width', '3px')
        .attr('fill', 'none');
    }

    // this.drawPoint(chart, data, data2, color, color2, x, y);
    this.drawSelector(chart, color, color2, data2, data3, data4, color3, color4);
    
    if (isPredict === true && predict) {
        this.drawPredict(chart, height, predict, x);
    }

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height + 10)
      .attr('fill', 'transparent')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .on('mousemove', function() {
        var selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
        // tslint:disable-next-line:forin
        for (let i in data) {
            var dataTime = Math.round(convertedTime((data[i] as any).time));
            selectDate = Math.round(selectDate);
            if (dataTime > selectDate) {
                var dataValue = (data[i] as any).value;
                var displayValue;

                if (Number(i) !== 0) {
                  var beforeDataTime = Math.round(convertedTime((data[Number(i) - 1] as any).time));
                  var beforeDataValue = (data[Number(i) - 1] as any).value;

                  displayValue = calculateMiddlePoint(beforeDataTime, beforeDataValue, 
                                                      dataTime, dataValue, selectDate);
                  displayValue = Number(displayValue.toFixed(2));
                } else {
                  displayValue = Number(dataValue);
                  selectDate = convertedTime((data[i] as any).time);
                }

                let textMove = 0;
                if (Number(i) === 0) {
                    textMove = 10;
                } else if (Number(i) === data.length - 1) {
                    textMove = -10;
                }

                let selector = d3.select('#' + self.props.name).select('.selector');
                selector.attr('fill', color)
                        .attr('x', x(selectDate) + 5)
                        .attr('y', y(displayValue) - 5);
    
                let textSelector = d3.select('#' + self.props.name).select('.text-selector');
                textSelector.attr('fill', 'white')
                        .text(displayValue)
                        .attr('x', x(selectDate) + textMove)
                        .attr('y', y(displayValue) - 15);

                let bgSelector = d3.select('#' + self.props.name).select('.selector-bg');
                bgSelector.attr('fill', color)
                        .attr('width', (textSelector as any).node().getComputedTextLength() + 12)
                        .attr('x', x(selectDate) + textMove - 5)
                        .attr('y', y(displayValue) - 30);

                if (data2 && data2.length !== 0) {
                    var dataValue2 = (data2[i] as any).value;
                    let displayValue2;

                    if (Number(i) !== 0) {
                      var beforeDataValue2 = (data2[Number(i) - 1] as any).value;
                      beforeDataTime = Math.round(convertedTime((data[Number(i) - 1] as any).time));

                      displayValue2 = calculateMiddlePoint(beforeDataTime, beforeDataValue2, 
                                                           dataTime, dataValue2, selectDate);
                      displayValue2 = Number(displayValue2.toFixed(2));
                    } else {
                      displayValue2 = Number(dataValue2);
                      selectDate = convertedTime((data2[i] as any).time);
                    }
                                                       
                    let selector2 = d3.select('#' + self.props.name).select('.selector-2');
                    selector2.attr('fill', color2)
                             .attr('x', x(selectDate) + 5)
                             .attr('y', y(displayValue2) - 5);

                    let textSelector2 = d3.select('#' + self.props.name).select('.text-selector-2');
                    textSelector2.attr('fill', 'white')
                            .text(displayValue2)
                            .attr('x', x(selectDate) + textMove)
                            .attr('y', y(displayValue2) - 10);

                    let bgSelector2 = d3.select('#' + self.props.name).select('.selector-bg-2');
                    bgSelector2.attr('fill', color2)
                            .attr('width', (textSelector2 as any).node().getComputedTextLength() + 12)
                            .attr('x', x(selectDate) + textMove - 5)
                            .attr('y', y(displayValue2) - 25);
                } 
                break;
            }
        }

        selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
        if (data3 && data3.length !== 0) {
          // tslint:disable-next-line:forin
          for (let i in data3) {
            dataTime = Math.round(convertedTime((data3[i] as any).time));
            selectDate = Math.round(selectDate);

            if (dataTime > selectDate) {
              var dataValue3 = (data3[i] as any).value;
              let displayValue3;

              if (Number(i) !== 0) {
                var beforeDataValue3 = (data3[Number(i) - 1] as any).value;
                beforeDataTime = Math.round(convertedTime((data3[Number(i) - 1] as any).time));

                displayValue3 = calculateMiddlePoint(beforeDataTime, beforeDataValue3, 
                                                     dataTime, dataValue3, selectDate);
                displayValue3 = Number(displayValue3.toFixed(2));
              } else {
                displayValue3 = Number(dataValue3);
                selectDate = convertedTime((data3[i] as any).time);
              }
                              
              let textMove = 0;
              if (Number(i) === 0) {
                  textMove = 10;
              } else if (Number(i) === data.length - 1) {
                  textMove = -10;
              }

              let selector3 = d3.select('#' + self.props.name).select('.selector-3');
              selector3.attr('fill', color3)
                      .attr('x', x(selectDate) + 5)
                      .attr('y', y(displayValue3) - 5);

              let textSelector3 = d3.select('#' + self.props.name).select('.text-selector-3');
              textSelector3.attr('fill', 'white')
                      .text(displayValue3)
                      .attr('x', x(selectDate) + textMove)
                      .attr('y', y(displayValue3) - 10); // + 25

              let bgSelector3 = d3.select('#' + self.props.name).select('.selector-bg-3');
              bgSelector3.attr('fill', color3)
                      .attr('width', (textSelector3 as any).node().getComputedTextLength() + 12)
                      .attr('x', x(selectDate) + textMove - 5)
                      .attr('y', y(displayValue3) - 25); // + 10

              if (data4 && data4.length !== 0) {
                var dataValue4 = (data4[i] as any).value;
                let displayValue4;

                if (Number(i) !== 0) {
                  var beforeDataValue4 = (data4[Number(i) - 1] as any).value;
                  beforeDataTime = Math.round(convertedTime((data4[Number(i) - 1] as any).time));

                  displayValue4 = calculateMiddlePoint(beforeDataTime, beforeDataValue4, 
                                                       dataTime, dataValue4, selectDate);
                  displayValue4 = Number(displayValue4.toFixed(2));
                } else {
                  displayValue4 = Number(dataValue4);
                  selectDate = convertedTime((data4[i] as any).time);
                }
                                                    
                let selector4 = d3.select('#' + self.props.name).select('.selector-4');
                selector4.attr('fill', color4)
                          .attr('x', x(selectDate) + 5)
                          .attr('y', y(displayValue4) - 5);

                let textSelector4 = d3.select('#' + self.props.name).select('.text-selector-4');
                textSelector4.attr('fill', 'white')
                        .text(displayValue4)
                        .attr('x', x(selectDate) + textMove)
                        .attr('y', y(displayValue4) - 10);

                let bgSelector4 = d3.select('#' + self.props.name).select('.selector-bg-4');
                bgSelector4.attr('fill', color4)
                        .attr('width', (textSelector4 as any).node().getComputedTextLength() + 12)
                        .attr('x', x(selectDate) + textMove - 5)
                        .attr('y', y(displayValue4) - 25); // + 10
              } 
              break;
            }
          }
        } 
      })
      .on('mousedown', function() {
        if (d3.event.ctrlKey) {
          var selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
          let isDelete = false;
          d3.selectAll('.mark-group').each(function(d: any, i: any) {
            let rect = d3.select(this).select('.mark');
            let tempx = (rect.nodes()[0] as any).x.baseVal.value;
            if (Math.abs(x(selectDate) - tempx) < 10) {
              d3.select(this).remove();
              isDelete = true;
            }
          });

          if (isDelete) { return; }

          // tslint:disable-next-line:forin
          for (let i in data) {
              var dataTime = Math.round(convertedTime((data[i] as any).time));
              selectDate = Math.round(selectDate);
              if (dataTime > selectDate) {
                  var dataValue = (data[i] as any).value;
                  var displayValue;
  
                  if (Number(i) !== 0) {
                    var beforeDataTime = Math.round(convertedTime((data[Number(i) - 1] as any).time));
                    var beforeDataValue = (data[Number(i) - 1] as any).value;
  
                    displayValue = calculateMiddlePoint(beforeDataTime, beforeDataValue, 
                                                        dataTime, dataValue, selectDate);
                    displayValue = Number(displayValue.toFixed(2));
                  } else {
                    displayValue = Number(dataValue);
                    selectDate = convertedTime((data[i] as any).time);
                  }
  
                  let textMove = 0;
                  if (Number(i) === 0) {
                      textMove = 10;
                  } else if (Number(i) === data.length - 1) {
                      textMove = -10;
                  }

                  self.drawMark(chart, x, y, selectDate, displayValue, textMove, color);
    
                  if (data2 && data2.length !== 0) {
                      var dataValue2 = (data2[i] as any).value;
                      let displayValue2;
  
                      if (Number(i) !== 0) {
                        var beforeDataValue2 = (data2[Number(i) - 1] as any).value;
                        beforeDataTime = Math.round(convertedTime((data[Number(i) - 1] as any).time));
  
                        displayValue2 = calculateMiddlePoint(beforeDataTime, beforeDataValue2, 
                                                             dataTime, dataValue2, selectDate);
                        displayValue2 = Number(displayValue2.toFixed(2));
                      } else {
                        displayValue2 = Number(dataValue2);
                        selectDate = convertedTime((data2[i] as any).time);
                      }
                               
                      self.drawMark(chart, x, y, selectDate, displayValue2, textMove, color2);
                  } 
                  break;
              }
          }
  
          selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
          if (data3 && data3.length !== 0) {
            // tslint:disable-next-line:forin
            for (let i in data3) {
              dataTime = Math.round(convertedTime((data3[i] as any).time));
              selectDate = Math.round(selectDate);
  
              if (dataTime > selectDate) {
                var dataValue3 = (data3[i] as any).value;
                let displayValue3;
  
                if (Number(i) !== 0) {
                  var beforeDataValue3 = (data3[Number(i) - 1] as any).value;
                  beforeDataTime = Math.round(convertedTime((data3[Number(i) - 1] as any).time));
  
                  displayValue3 = calculateMiddlePoint(beforeDataTime, beforeDataValue3, 
                                                       dataTime, dataValue3, selectDate);
                  displayValue3 = Number(displayValue3.toFixed(2));
                } else {
                  displayValue3 = Number(dataValue3);
                  selectDate = convertedTime((data3[i] as any).time);
                }
                                
                let textMove = 0;
                if (Number(i) === 0) {
                    textMove = 10;
                } else if (Number(i) === data.length - 1) {
                    textMove = -10;
                }
                
                self.drawMark(chart, x, y, selectDate, displayValue3, textMove, color3);
  
                if (data4 && data4.length !== 0) {
                  var dataValue4 = (data4[i] as any).value;
                  let displayValue4;
  
                  if (Number(i) !== 0) {
                    var beforeDataValue4 = (data4[Number(i) - 1] as any).value;
                    beforeDataTime = Math.round(convertedTime((data4[Number(i) - 1] as any).time));
  
                    displayValue4 = calculateMiddlePoint(beforeDataTime, beforeDataValue4, 
                                                         dataTime, dataValue4, selectDate);
                    displayValue4 = Number(displayValue4.toFixed(2));
                  } else {
                    displayValue4 = Number(dataValue4);
                    selectDate = convertedTime((data4[i] as any).time);
                  }
                             
                  self.drawMark(chart, x, y, selectDate, displayValue4, textMove, color4);
                } 
                break;
              }
            }
          } 
        }
      });
  }

  drawSingleFigureBox(color: string, unit: string, name: string, title: string) {
    var svg = d3.select('#' + name);
    svg.append('text')
            .attr('class', 'figure-value')
            .text('None')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 55); 

    svg.append('text')
            .attr('class', 'figure-unit')
            .text(unit)
            .attr('x', SizeTrack.TRACK_WIDTH + 125)
            .attr('y', 55); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 65)
            .attr('width', 130)
            .attr('height', 55)
            .attr('fill', color);

    svg.append('text')
            .attr('class', 'figure-name')
            .text(title)
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 85); 
  }

  drawDoubleFigureBox(color: string, color2: string, unit: string, name: string, 
                      title: string, title2: string) {
    var svg = d3.select('#' + name);
    svg.append('text')
        .attr('class', 'figure-value-1')
        .text('None')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-value-2')
        .text('None')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 90); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text(unit)
        .attr('x', SizeTrack.TRACK_WIDTH + 125)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text(unit)
        .attr('x', SizeTrack.TRACK_WIDTH + 125)
        .attr('y', 90); 

    svg.append('rect')
        .attr('class', 'figure-box')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 40)
        .attr('width', 130)
        .attr('height', 25)
        .attr('fill', color);

    svg.append('rect')
        .attr('class', 'figure-box')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 95)
        .attr('width', 130)
        .attr('height', 25)
        .attr('fill', color2);

    svg.append('text')
        .attr('class', 'figure-name')
        .text(title)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 59); 

    svg.append('text')
        .attr('class', 'figure-name')
        .text(title2 as string)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 114); 
  }

  componentDidMount() {
    d3.select('#' + this.props.name).selectAll('.line-chart').remove();
    let color = this.props.color;
    let color2 = this.props.color2 as string;
    let color3 = this.props.color3 as string;
    let color4 = this.props.color4 as string;
    // let unit = this.props.unit;

    if (this.props.value.length !== 0) {
      let zoom = (this.props.zoom) ? this.props.zoom : [0, 1];

      let value = this.props.value;
      let value2 = this.props.value2 as POINT[];
      let value3 = this.props.value3 as POINT[];
      let value4 = this.props.value4 as POINT[];

      let range = this.props.range;

      let start;
      let end;
      
      if (this.props.patient.info.admittime) {
        start = convertedTime(this.props.patient.info.admittime);
        end = convertedTime(this.props.patient.info.dischtime);
      } else {
        start = convertedTime(this.props.value[0].time);
        end = convertedTime(this.props.value[this.props.value.length - 1].time);
      }

      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];

      let predict = (this.props.patient) ? this.props.patient.predict : null;

      this.drawChart(value, value2, range, timeRange, color, color2, predict, 
                     this.props.predict, this.props.name, this.props.isGrid,
                     this.props.isNormal1, this.props.isNormal2,
                     this.props.normalRange1, this.props.normalRange2,
                     value3, value4, color3, color4,
                     this.props.isShade1, this.props.isShade2);
    }

    // if (!this.props.title2) {
    //   this.drawSingleFigureBox(color, unit, this.props.name, this.props.title);
    // } else {
    //   this.drawDoubleFigureBox(color, color2 , unit, this.props.name, this.props.title, this.props.title2);
    // }
  }

  componentWillReceiveProps(props: Props) {
    d3.select('#' + this.props.name).selectAll('*').remove();

    let color = props.color;
    let color2 = props.color2 as string;
    let color3 = props.color3 as string;
    let color4 = props.color4 as string;
    let name;
    if (props.name.includes('Top')) {
        name = props.name;
        
        this.isGetTime = false;
    } else {
        name = this.props.name;
    }
    // let unit = props.unit;

    if (props.value.length !== 0) {
      let value = props.value;
      let value2 = props.value2 as POINT[];
      let value3 = props.value3 as POINT[];
      let value4 = props.value4 as POINT[];
      let range = props.range;

      let start, end;

      if (props.secondTimeRange) {
        if (!this.isGetTime) {
          let unifyTime = unifyTwoPeriod(
            (props.patient as any).info.admittime,
            (props.patient as any).info.dischtime,
            props.secondTimeRange[0],
            props.secondTimeRange[1]
          );

          start = convertedTime(unifyTime[0]);
          end = convertedTime(unifyTime[1]);

          value = transformYear(new Date((props.patient as any).info.dischtime).getFullYear(), value);
          if (value2) {
            value2 = transformYear(new Date((props.patient as any).info.dischtime).getFullYear(), value2);
          }

          if (value3) {
            value3 = transformYear(new Date(props.secondTimeRange[1]).getFullYear(), value3);
          }
          if (value4) {
            value4 = transformYear(new Date(props.secondTimeRange[1]).getFullYear(), value4);
          }
          
          this.isGetTime = true;
          this.start = start;
          this.end = end;
          this.value = value;
          this.value2 = value2;
          this.value3 = value3;
          this.value4 = value4;
        }
      }  else {
        start = convertedTime((props.patient as any).info.admittime);
        end = convertedTime((props.patient as any).info.dischtime);
  
        if (isNaN(start)) {
          start = convertedTime(props.value[0].time);
          end = convertedTime(props.value[props.value.length - 1].time);
        }

        this.start = start;
        this.end = end;
        this.value = value;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
      }

      let zoom = (props.zoom) ? props.zoom : [0, 1];
      let timeRange = [this.start + (this.end - this.start) * zoom[0], 
          this.start + (this.end - this.start) * zoom[1]] as [number, number];
      
      // if (name.includes('Top')) {
      //   console.log(name)
      //   console.log(this.value)
      // }
      d3.select('#' + this.props.name).attr('id', name);  
      this.drawChart(this.value, this.value2, range, timeRange, color, color2, 
                     (props.patient as any).predict, props.predict, name, 
                     props.isGrid, props.isNormal1, props.isNormal2,
                     props.normalRange1 as [number, number], props.normalRange2 as [number, number],
                     this.value3, this.value4, color3, color4,
                     props.isShade1, props.isShade2);
    }
    
    // if (!props.title2) {
    //   this.drawSingleFigureBox(color, unit, this.props.name, props.title);
    // } else {
    //   this.drawDoubleFigureBox(color, color2 , unit, this.props.name, props.title, props.title2 as any);
    // }
  }

  render() {
    return (
      <svg id={this.props.name} className="line-chart"/>
    );
  }
}
// export default LineChart;
const LineChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(LineChart);
export default LineChartContainer;