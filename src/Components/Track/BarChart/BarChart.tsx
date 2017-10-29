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

  drawChart(data1: Object[], data2: Object[], range: [number, number], 
            timeRange: [number, number], color: string, color2: string) {
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
              
    var svg = d3.select('#' + self.props.name).append('svg')
        .attr('class', 'bar-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
        
    var chart = svg.append('g')
            .attr('clip-path', 'url(#clipPath-' + self.props.name + ')')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data in the domains
    x.domain([timeRange[0], timeRange[1]]);
    y.domain(range);
    //x.domain([292810, 292811.8]);
    //y.domain([0, 200]);

    // append the rectangles for the bar chart
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

    // add the x Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(d3.axisLeft(y).ticks(5, 's'));
  }

  drawFigureBox(color: string, color2: string, unit: string) {
    var svg = d3.select('#' + this.props.name);
    svg.append('text')
        .attr('class', 'figure-value-1')
        .text('822')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-value-2')
        .text('822')
        .attr('x', SizeTrack.TRACK_WIDTH + 40)
        .attr('y', 90); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text(unit)
        .attr('x', SizeTrack.TRACK_WIDTH + 85)
        .attr('y', 35); 

    svg.append('text')
        .attr('class', 'figure-unit')
        .text(unit)
        .attr('x', SizeTrack.TRACK_WIDTH + 85)
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

  componentWillReceiveProps(props: Props) {
    if (this.props.patient.info.id === '' && props && props.patient) {
        let value = props.value;
        let value2 = props.value2 as POINT[];
        let range = props.range;
        let timeRange = [convertedTime(props.patient.info.admittime), 
            convertedTime(props.patient.info.dischtime)] as [number, number];
        let color = props.color;
        let color2 = props.color2 as string;
        let unit = props.unit;

        this.drawChart(value, value2, range, timeRange, color, color2);
        this.drawFigureBox(color, color2 , unit);
    } else {
        let start = convertedTime(this.props.patient.info.admittime);
        let end = convertedTime(this.props.patient.info.dischtime);
        let zoom = (props.zoom) ? props.zoom : [0, 100];
        // console.log(props.zoom);
        // console.log(start + (end - start) * this.props.zoom[0]);
        // console.log(start + (end - start) * this.props.zoom[1]);

        let value = this.props.value;
        let value2 = this.props.value2 as POINT[];
        let range = this.props.range;
        let timeRange = [start + (end - start) * zoom[0], 
            start + (end - start) * zoom[1]] as [number, number];
        let color = this.props.color;
        let color2 = this.props.color2 as string;

        d3.select('#' + this.props.name).selectAll('.bar-chart').remove();

        this.drawChart(value, value2, range, timeRange, color, color2);
    }
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}
//export default BarChart;
const BarChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(BarChart);
export default BarChartContainer;