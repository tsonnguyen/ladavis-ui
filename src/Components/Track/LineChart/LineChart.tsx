import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, POINT } from '../../../Interfaces';
import { convertedTime } from  '../../../api';
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
  unit: string;
  color: string;
  color2?: string;
  position: number;
  patient?: PATIENT;
  zoom?: [number, number];
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

  constructor() {
    super();
  }

  drawChart(data: Object[], data2: Object[], range: [number, number], 
            timeRange: [number, number], color: string, color2: string, 
            predict: Number[]|null = null, isPredict: any, name: string, isGrid: boolean) {
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
   
    var chart = svg.append('g')
            .attr('clip-path', 'url(#clipPath-' + self.props.name + ')')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart.append('text')
        .attr('class', 'text-selector')
        .attr('fill', color)
        .text('')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('transform', 'translate(-10,0)');

    chart.append('rect')
        .attr('class', 'selector')
        .attr('fill', 'transparent')
        .attr('rx', '100')
        .attr('ry', '100')
        .attr('x', '0px')
        .attr('width', '10px')
        .attr('y', 0)
        .attr('height', '10px')
        .attr('transform', 'translate(-10,0)');

    chart.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline)
        .attr('stroke', color)
        .attr('stroke-width', '3px')
        .attr('fill', 'none');
    
    // chart.selectAll('.point')
    //     .data(data)
    //     .enter().append('rect')
    //       .attr('class', 'bar')
    //       .attr('fill', color)
    //       .attr('rx', '100')
    //       .attr('ry', '100')
    //       .attr('x', function(d: any) { return x(Number(convertedTime(d.time))) + 7; })
    //       .attr('width', '5px')
    //       .attr('y', function(d: any) { return y(Number(d.value)) - 2.5; })
    //       .attr('height', '5px')
    //       .attr('transform', 'translate(-10,0)');

    if (data2) {
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

        chart.append('path')
          .data([data2])
          .attr('class', 'line')
          .attr('d', valueline)
          .attr('stroke', color2)
          .attr('stroke-width', '3px')
          .attr('fill', 'none');

        // chart.selectAll('.point-2')
        //   .data(data2)
        //   .enter().append('rect')
        //     .attr('class', 'bar')
        //     .attr('fill', color2)
        //     .attr('rx', '100')
        //     .attr('ry', '100')
        //     .attr('x', function(d: any) { return x(Number(convertedTime(d.time))) + 7; })
        //     .attr('width', '5px')
        //     .attr('y', function(d: any) { return y(Number(d.value)) - 2.5; })
        //     .attr('height', '5px')
        //     .attr('transform', 'translate(-10,0)');
    }

    if (isPredict === true && predict) {
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

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width + 10)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .on('mousemove', function() {
        var selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
        // tslint:disable-next-line:forin
        for (var i in data) {
            var dataTime = Math.round(convertedTime((data[i] as any).time));
            selectDate = Math.round(selectDate);
            if (Math.abs(dataTime - selectDate) < (timeRange[1] - timeRange[0]) / 50) {
                var displayValue = Number((data[i] as any).value);
                let textMove = 0;
                if (Number(i) === 0) {
                    textMove = 10;
                } else if (Number(i) === data.length - 1) {
                    textMove = -10;
                }

                let selector = d3.select('#' + self.props.name).select('.selector');
                selector.attr('fill', color)
                        .attr('x', x(dataTime) + 5)
                        .attr('y', y(displayValue) - 5);
    
                let textSelector = d3.select('#' + self.props.name).select('.text-selector');
                textSelector.attr('fill', color)
                        .text(displayValue)
                        .attr('x', x(dataTime) + textMove)
                        .attr('y', y(displayValue) - 10);

                if (data2 && data2.length !== 0) {
                    let displayValue2 = Number((data2[i] as any).value);
                    let selector2 = d3.select('#' + self.props.name).select('.selector-2');
                    selector2.attr('fill', color2)
                             .attr('x', x(dataTime) + 5)
                             .attr('y', y(displayValue2) - 5);

                    let textSelector2 = d3.select('#' + self.props.name).select('.text-selector-2');
                    textSelector2.attr('fill', color2)
                            .text(displayValue)
                            .attr('x', x(dataTime) + textMove)
                            .attr('y', y(displayValue2) - 10);
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
      let range = this.props.range;
      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];
      let predict = (this.props.patient) ? this.props.patient.predict : null;

      this.drawChart(value, value2, range, timeRange, color, color2, predict, 
                     this.props.predict, this.props.name, this.props.isGrid);
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
    let name;
    if (props.name.includes('top')) {
        name = props.name;
    } else {
        name = this.props.name;
    }
    // let unit = props.unit;

    if (props.value.length !== 0) {
      let value = props.value;
      let value2 = props.value2 as POINT[];
      let range = props.range;

      let start = convertedTime((props.patient as any).info.admittime);
      let end = convertedTime((props.patient as any).info.dischtime);

      if (isNaN(start)) {
        start = convertedTime(props.value[0].time);
        end = convertedTime(props.value[props.value.length - 1].time);
      }

      let zoom = (props.zoom) ? props.zoom : [0, 1];
      let timeRange = [start + (end - start) * zoom[0], 
            start + (end - start) * zoom[1]] as [number, number];
    
      this.drawChart(value, value2, range, timeRange, color, color2, 
                     (props.patient as any).predict, props.predict, name, props.isGrid);
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