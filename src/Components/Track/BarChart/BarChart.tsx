import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, POINT } from '../../../Interfaces';
import { convertedTime } from  '../../../api';
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
  constructor() {
    super();
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

  drawChart(data1: Object[], data2: Object[], range: [number, number], 
            timeRange: [number, number], color: string, color2: string, 
            predict: Number[]|null = null, isPredict: any, name: string, isGrid: boolean,
            isNormal1: boolean, isNormal2: boolean,
            normalRange1: [number, number],  normalRange2: [number, number]) {
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

    var chart = svg.append('g')
                .attr('clip-path', 'url(#clipPath-' + name + ')')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.drawNormalRange(chart, isNormal1, isNormal2, normalRange1, normalRange2, color, color2, y);
    this.drawGrid(svg, margin, width, y, isGrid);

    chart.selectAll('.bar')
        .data(data1)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('fill', color)
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(-10,0)');

    chart.append('rect')
        .attr('class', 'selector')
        .attr('fill', color)
        .attr('x', '0px')
        .attr('width', '10px')
        .attr('y', 0)
        .attr('height', '0px')
        .attr('transform', 'translate(-10,0)');
    
    chart.selectAll('.bar2')
        .data(data2)
        .enter().append('rect')
          .attr('class', 'bar2')
          .attr('fill', color2)
          .attr('x', function(d: any) { return x(Number(convertedTime(d.time))); })
          .attr('width', '10px')
          .attr('y', function(d: any) { return y(Number(d.value)); })
          .attr('height', function(d: any) { return height - y(Number(d.value)); })
          .attr('transform', 'translate(0,0)');

    chart.append('rect')
        .attr('class', 'selector-2')
        .attr('fill', color2)
        .attr('x', '0px')
        .attr('width', '10px')
        .attr('y', 0)
        .attr('height', '0px')
        .attr('transform', 'translate(0,0)');

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
    
    svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width + 10)
    .attr('height', height)
    .attr('fill', 'transparent')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .on('mousemove', function() {
            var selectDate = (timeRange[1] - timeRange[0]) * d3.mouse(this as any)[0] / width + timeRange[0];
            // tslint:disable-next-line:forin
            for (var i in data1) {
                var dataTime = Math.round(convertedTime((data1[i] as any).time));
                selectDate = Math.round(selectDate);
                if (Math.abs(dataTime - selectDate) < 5) {
                    var displayValue = Number((data1[i] as any).value);

                    if (data2) {
                        d3.select('#' + self.props.name).select('.figure-value-1').text(displayValue);
                        let selector = d3.select('#' + self.props.name).select('.selector');
                        selector.attr('x', x(dataTime))
                                .attr('y', y(displayValue))
                                .attr('height', height - y(Number(displayValue)));

                        let displayValue2 = Number((data2[i] as any).value);
                        let selector2 = d3.select('#' + self.props.name).select('.selector-2');
                        d3.select('#' + self.props.name).select('.figure-value-2').text(displayValue2);
                        selector2.attr('x', x(dataTime))
                                 .attr('y', y(displayValue2))
                                 .attr('height', height - y(Number(displayValue2)));
                    } else {
                        let selector = d3.select('#' + self.props.name).select('.selector');
                        d3.select('#' + self.props.name).select('.figure-value').text(displayValue);
                        selector.attr('x', x(dataTime) + 5)
                                .attr('y', y(displayValue) - 5);
                    }

                }
            }
        });
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
      let range = this.props.range;
      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];
      let predict = (this.props.patient) ? this.props.patient.predict : null;

      this.drawChart(value, value2, range, timeRange, color, color2, predict, 
                     this.props.predict, this.props.name, this.props.isGrid,
                     this.props.isNormal1, this.props.isNormal2,
                     this.props.normalRange1, this.props.normalRange2);
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
        let range = props.range;
        // let unit = props.unit;

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
                       (props.patient as any).predict, props.predict, name, props.isGrid,
                       props.isNormal1, props.isNormal2,
                       props.normalRange1 as [number, number], props.normalRange2 as [number, number]);
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