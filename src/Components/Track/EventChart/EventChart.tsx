import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import ROOTSTATE, { PATIENT, EVENT } from '../../../Interfaces';
import { convertedTime, unifyTwoPeriod, transformYear } from  '../../../api';
import * as SizeTrack from '../SizeTrack';

import './EventChart.css';

interface Props {
  name: string;
  title: string;
  title2: string;
  value: EVENT[];
  value2: EVENT[];
  color: string;
  color2?: string;
  position: number;
  patient?: PATIENT;
  zoom?: [number, number];
  value3?: EVENT[];
  value4?: EVENT[];
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

class EventChart extends React.Component<any, States> {
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

  drawChart(data1: Object[], data2: Object[], timeRange: [number, number], name: string,
            data3: Object[], data4: Object[], color: string, color2: string) {
    // var data = [
    //   [1, 1, 80], 
    //   [3, 0, 20],
    //   [5, 1, 10],
    //   [7, 1, 80]
    // ];

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = SizeTrack.TRACK_WIDTH - margin.left - margin.right,
        height = SizeTrack.TRACK_HEIGHT - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
    var y = d3.scaleLinear()
              .range([height, 0]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('#' + name).append('svg')
        .attr('class', 'event-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 
                'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data in the domains
    x.domain([timeRange[0], timeRange[1]]);
    y.domain([0, 3]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data1)
        .enter().append('rect')
          .attr('fill', color)   
          .attr('class', 'bar')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(2.8); })
          .attr('width', '10px') 
          .attr('height', '10px')
          .attr('transform', 'translate(-5,0)');

    svg.selectAll('.bar2')
        .data(data2)
        .enter().append('rect')
          .attr('fill', color2)   
          .attr('class', 'bar2')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(1.7); })
          .attr('width', '10px')
          .attr('height', '10px')
          .attr('transform', 'translate(-5,0)');
    
    if (data3) {
      svg.selectAll('.bar3')
        .data(data3)
        .enter().append('rect')
          .attr('class', 'bar3')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(1.7); })
          .attr('width', '10px')
          .attr('height', '10px')
          .attr('transform', 'translate(-5,0)');
    }

    if (data4) {
      svg.selectAll('.bar4')
        .data(data4)
        .enter().append('rect')
          .attr('class', 'bar4')
          .attr('x', function(d: any) { return x(Number(convertedTime(d.startdate))); })
          .attr('y', function(d: any) { return y(1.7); })
          .attr('width', '10px')
          .attr('height', '10px')
          .attr('transform', 'translate(-5,0)');
    }

    // add the x Axis
    // svg.append('g')
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(d3.axisBottom(x));

    // add the y Axis
    // svg.append('g')
    //     .call(d3.axisLeft(y));
  }

  drawFigureBox() {
    var svg = d3.select('#' + this.props.name);
    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 20)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text(this.props.title)
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 40); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 55)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text(this.props.title2)
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 75); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 40)
            .attr('y', 90)
            .attr('width', 90)
            .attr('height', 30)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('')
            .attr('x', SizeTrack.TRACK_WIDTH + 50)
            .attr('y', 110); 

    svg.append('rect')
            .attr('class', 'figure-box')
            .attr('x', SizeTrack.TRACK_WIDTH + 135)
            .attr('y', 20)
            .attr('width', 35)
            .attr('height', 100)
            .attr('fill', 'rgba(255, 0, 0, 0.7)');

    svg.append('text')
            .attr('class', 'figure-name')
            .text('')
            .attr('x', 40)
            .attr('y', -(SizeTrack.TRACK_WIDTH + 145))
            .attr('transform', 'rotate(90)'); 
  }

  componentDidMount() {
    d3.select('#' + this.props.name).selectAll('.event-chart').remove();
    let color = this.props.color as string;
    let color2 = this.props.color2 as string;

    if (this.props.value.length !== 0) {
      let start = convertedTime((this.props.patient as any).info.admittime);
      let end = convertedTime((this.props.patient as any).info.dischtime);
      
      let zoom = (this.props.zoom) ? this.props.zoom : [0, 1];

      let value = this.props.value;
      let value2 = this.props.value2 as any;
      let value3 = this.props.value3 as any;
      let value4 = this.props.value4 as any;

      let timeRange = [start + (end - start) * zoom[0], 
          start + (end - start) * zoom[1]] as [number, number];

      this.drawChart(value, value2, timeRange, this.props.name, value3, value4, color, color2);
    }
  }

  componentWillReceiveProps(props: Props) {
    d3.select('#' + this.props.name).selectAll('.event-chart').remove();
    let color = props.color as string;
    let color2 = props.color2 as string;

    let name;
    if (props.name.includes('top')) {
      name = props.name;
    } else {
      name = this.props.name;
    }

    if (props.value.length !== 0) {
      let value = props.value;
      let value2 = props.value2 as EVENT[];
      let value3 = props.value3 as EVENT[];
      let value4 = props.value4 as EVENT[];

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
    
      this.drawChart(this.value, this.value2, timeRange, name, this.value3, this.value4, color, color2);
      // this.drawFigureBox(color, color2 , unit);
    } 
  }

  render() {
    return (
      <svg id={this.props.name} className="bar-chart"/>
    );
  }
}

// export default EventChart;
const EventChartContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(EventChart);
export default EventChartContainer;