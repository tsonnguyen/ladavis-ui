import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, POINT } from '../../../Interfaces';
import { convertedTime, unifyTwoPeriod, transformYear } from  '../../../api';
import * as SizeTrack from '../SizeTrack';

import './BarChart.css';

interface Props {
  name: string;
  title: string;
  title2: string;
  value: POINT[];
  value2: POINT[];
  unit: string;
  range: [number, number];
  predict?: boolean;
  isGrid: boolean;
  isNormal1: boolean;
  isNormal2: boolean;
  normalRange1?: [number, number];
  normalRange2?: [number, number];
  color: string;
  color2: string;
  position: number;
  patient?: PATIENT;
  zoom?: [number, number];
  value3?: POINT[];
  value4?: POINT[];
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

class BarChart extends React.Component<any, States> {
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
    }
  }

  drawChart(data1: Object[], data2: Object[], range: [number, number], 
            timeRange: [number, number], color: string, color2: string, 
            predict: Number[]|null = null, isPredict: any, name: string, isGrid: boolean,
            isNormal1: boolean, isNormal2: boolean,
            normalRange1: [number, number],  normalRange2: [number, number],
            data3: Object[], data4: Object[]) {
    var self = this;

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
        height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
    var y = d3.scaleLinear()
              .range([height, 0]);
    x.domain([timeRange[0], timeRange[1]]);
    y.domain(range);
              
    var svg = d3.select('#' + name).append('svg')
        .attr('class', 'bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    this.drawGrid(svg, margin, width, y, isGrid);

    var chart = svg.append('g')
                .attr('clip-path', 'url(#clipPath-' + name + ')')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.drawNormalRange(chart, isNormal1, isNormal2, normalRange1, normalRange2, color, color2, y);
    
    chart.selectAll('.bar')
        .data(data1)
        .enter().append('rect')
          .attr('class', 'bar bar-of-chart')
          .attr('fill', color)
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', function(d: any, i: any) { 
            if (i === 0) {
              return 'translate(0,0)'; 
            } else {
              return 'translate(-10,0)'; 
            } 
          })
          .on('mousemove', function(d: any, i: any) {
            var selectDate = Math.round(convertedTime(d.time));
            let displayValue = Math.round(d.value);

            let textSelector = d3.select('#' + self.props.name).select('.text-selector');
            textSelector.attr('fill', 'white')
                    .text(displayValue)
                    .attr('x', x(selectDate) + 1)
                    .attr('y', y(displayValue) - 15)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');

            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg');
            bgSelector.attr('fill', color)
                    .attr('width', (textSelector as any).node().getComputedTextLength() + 12)
                    .attr('x', x(selectDate) - 5)
                    .attr('y', y(displayValue) - 30)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');
          })
          .on('mouseout', function() {
            let textSelector = d3.select('#' + self.props.name).select('.text-selector');
            textSelector.attr('x', -100).attr('y', -100);
            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg');
            bgSelector.attr('x', -100).attr('y', -100);
          })
          .on('mousedown', function(d: any, i: any) {
            if (d3.event.ctrlKey) {
              let selectDate = Math.round(convertedTime(d.time));
              let displayValue = Math.round(d.value);

              let isDelete = false;
              d3.selectAll('.mark-group').each(function() {
                let rect = d3.select(this).select('.mark-bg');
                let tempx = (rect.nodes()[0] as any).x.baseVal.value;
                if (Math.abs(x(selectDate) - tempx) < 10) {
                  d3.select(this).remove();
                  isDelete = true;
                }
              });
    
              if (isDelete) { return; }
              
              self.drawMark(chart, x, y, selectDate, displayValue, 0, color);
            }
          });

    if (data2) {
        chart.selectAll('.bar2')
            .data(data2)
            .enter().append('rect')
                .attr('class', 'bar2 bar-of-chart')
                .attr('fill', color2)
                .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
                .attr('width', '10px')
                .attr('y', function(d: any) { return y(Number(d.value)); })
                .attr('height', function(d: any) { return height - y(Number(d.value)); })
                .attr('transform', function(d: any, i: any) { 
                  if (i === 0) {
                    return 'translate(10,0)'; 
                  } else {
                    return 'translate(0,0)'; 
                  } 
                }).on('mousemove', function(d: any, i: any) {
                  var selectDate = Math.round(convertedTime(d.time));
                  let displayValue = Math.round(d.value);
      
                  let textSelector = d3.select('#' + self.props.name).select('.text-selector-2');
                  textSelector.attr('fill', 'white')
                          .text(displayValue)
                          .attr('x', x(selectDate) + 1)
                          .attr('y', y(displayValue) - 15)
                          .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');
      
                  let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-2');
                  bgSelector.attr('fill', color2)
                          .attr('width', (textSelector as any).node().getComputedTextLength() + 12)
                          .attr('x', x(selectDate) - 5)
                          .attr('y', y(displayValue) - 30)
                          .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');
                })
                .on('mouseout', function() {
                  let textSelector = d3.select('#' + self.props.name).select('.text-selector-2');
                  textSelector.attr('x', -100).attr('y', -100);
                  let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-2');
                  bgSelector.attr('x', -100).attr('y', -100);
                })
                .on('mousedown', function(d: any, i: any) {
                  if (d3.event.ctrlKey) {
                    let selectDate = Math.round(convertedTime(d.time));
                    let displayValue = Math.round(d.value);
      
                    let isDelete = false;
                    d3.selectAll('.mark-group').each(function() {
                      let rect = d3.select(this).select('.mark-bg');
                      let tempx = (rect.nodes()[0] as any).x.baseVal.value;
                      if (Math.abs(x(selectDate) - tempx) < 10) {
                        d3.select(this).remove();
                        isDelete = true;
                      }
                    });
          
                    if (isDelete) { return; }
                    
                    self.drawMark(chart, x, y, selectDate, displayValue, 0, color);
                  }
                });
    }
    
    if (data3) {
      chart.selectAll('.bar3')
        .data(data3)
        .enter().append('rect')
          .attr('class', 'bar3 bar-of-chart')
          .attr('fill', color2)
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(0,0)')
          .on('mousemove', function(d: any, i: any) {
            var selectDate = Math.round(convertedTime(d.time));
            let displayValue = Math.round(d.value);

            let textSelector = d3.select('#' + self.props.name).select('.text-selector-3');
            textSelector.attr('fill', 'white')
                    .text(displayValue)
                    .attr('x', x(selectDate) + 1)
                    .attr('y', y(displayValue) - 15)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');

            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-3');
            bgSelector.attr('fill', color)
                    .attr('width', (textSelector as any).node().getComputedTextLength() + 12)
                    .attr('x', x(selectDate) - 5)
                    .attr('y', y(displayValue) - 30)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');
          })
          .on('mouseout', function() {
            let textSelector = d3.select('#' + self.props.name).select('.text-selector-3');
            textSelector.attr('x', -100).attr('y', -100);
            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-3');
            bgSelector.attr('x', -100).attr('y', -100);
          })
          .on('mousedown', function(d: any, i: any) {
            if (d3.event.ctrlKey) {
              let selectDate = Math.round(convertedTime(d.time));
              let displayValue = Math.round(d.value);

              let isDelete = false;
              d3.selectAll('.mark-group').each(function() {
                let rect = d3.select(this).select('.mark-bg');
                let tempx = (rect.nodes()[0] as any).x.baseVal.value;
                if (Math.abs(x(selectDate) - tempx) < 10) {
                  d3.select(this).remove();
                  isDelete = true;
                }
              });
    
              if (isDelete) { return; }
              
              self.drawMark(chart, x, y, selectDate, displayValue, 0, color);
            }
          });
    }

    if (data4) {
      chart.selectAll('.bar4')
        .data(data4)
        .enter().append('rect')
          .attr('class', 'bar4 bar-of-chart')
          .attr('fill', color2)
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(0,0)')
          .on('mousemove', function(d: any, i: any) {
            var selectDate = Math.round(convertedTime(d.time));
            let displayValue = Math.round(d.value);

            let textSelector = d3.select('#' + self.props.name).select('.text-selector-4');
            textSelector.attr('fill', 'white')
                    .text(displayValue)
                    .attr('x', x(selectDate) + 1)
                    .attr('y', y(displayValue) - 15)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');

            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-4');
            bgSelector.attr('fill', color2)
                    .attr('width', (textSelector as any).node().getComputedTextLength() + 12)
                    .attr('x', x(selectDate) - 5)
                    .attr('y', y(displayValue) - 30)
                    .attr('transform', (i === 0) ? 'translate(0,0)' : 'translate(-10,0)');
          })
          .on('mouseout', function() {
            let textSelector = d3.select('#' + self.props.name).select('.text-selector-4');
            textSelector.attr('x', -100).attr('y', -100);
            let bgSelector = d3.select('#' + self.props.name).select('.selector-bg-4');
            bgSelector.attr('x', -100).attr('y', -100);
          })
          .on('mousedown', function(d: any, i: any) {
            if (d3.event.ctrlKey) {
              let selectDate = Math.round(convertedTime(d.time));
              let displayValue = Math.round(d.value);

              let isDelete = false;
              d3.selectAll('.mark-group').each(function() {
                let rect = d3.select(this).select('.mark-bg');
                let tempx = (rect.nodes()[0] as any).x.baseVal.value;
                if (Math.abs(x(selectDate) - tempx) < 10) {
                  d3.select(this).remove();
                  isDelete = true;
                }
              });
    
              if (isDelete) { return; }
              
              self.drawMark(chart, x, y, selectDate, displayValue, 0, color);
            }
          });
    }

    this.drawSelector(chart, color, color2, data2, data3, data4, color, color2);

    if (isPredict === true && predict) {
        var predictY = d3.scaleLinear().range([height, 0]);
        predictY.domain([0, 1]);

        chart.selectAll('.bar')
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
  }

  drawFigureBox(color: string, color2: string, unit: string) {
    var svg = d3.select('#' + this.props.name);
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
        .text(this.props.title)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 59); 

    svg.append('text')
        .attr('class', 'figure-name')
        .text(this.props.title2)
        .attr('x', SizeTrack.TRACK_WIDTH + 50)
        .attr('y', 114); 
  }

  componentDidMount() {
    d3.select('#' + this.props.name).selectAll('.bar-chart').remove();

    let color = this.props.color;
    let color2 = this.props.color2 as string;
    // let unit = this.props.unit;

    if (this.props.value.length !== 0) {
      let start;
      let end;

      if (this.props.patient.info.admittime) {
          start = convertedTime(this.props.patient.info.admittime);
          end = convertedTime(this.props.patient.info.dischtime);
      } else {
          start = convertedTime(this.props.value[0].time);
          end = convertedTime(this.props.value[this.props.value.length - 1].time);
      }
      
      let zoom = (this.props.zoom) ? this.props.zoom : [0, 1];

      let value = this.props.value;
      let value2 = this.props.value2 as POINT[];
      let value3 = this.props.value3 as POINT[];
      let value4 = this.props.value4 as POINT[];

      let range = this.props.range;

      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];
      let predict = (this.props.patient) ? this.props.patient.predict : null;

      this.drawChart(value, value2, range, timeRange, color, color2, predict, 
                     this.props.predict, this.props.name, this.props.isGrid,
                     this.props.isNormal1, this.props.isNormal2,
                     this.props.normalRange1, this.props.normalRange2,
                     value3, value4);
    }
  }

  componentWillReceiveProps(props: Props) {

    d3.select('#' + this.props.name).selectAll('.bar-chart').remove();

    let color = props.color;
    let color2 = props.color2 as string;
    let name;
    if (props.name.includes('Top')) {
        name = props.name;
    } else {    
        name = this.props.name;
    }

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
      
        this.drawChart(this.value, this.value2, range, timeRange, color, color2, 
                       (props.patient as any).predict, props.predict, name, props.isGrid,
                       props.isNormal1, props.isNormal2,
                       props.normalRange1 as [number, number], props.normalRange2 as [number, number],
                       this.value3, this.value4);
        // this.drawFigureBox(color, color2 , unit);
    }
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}

// export default BarChart;
const BarChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(BarChart);
export default BarChartContainer;