import * as React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';


import ROOTSTATE from '../../Interfaces';

import { getDatesBetween, formatDate } from '../../api';
import { updateZoomRange } from '../../Actions/zoomActions';

import './TimeBar.css';

interface Props {
  startTime: string;
  endTime: string;
  zoom?: [number, number];
  updateZoomRange?: (zoomRange: [number, number]) => void;
}

interface States {
  adjustPos: number;
  adjustLength: number;
}

const mapStateToProps = (state: ROOTSTATE, ownProps: Props) => ({
  zoom: state.zoom
});
const mapDispatchToProps = (dispatch: any) => ({ 
  updateZoomRange: (zoomRange: [number, number]) => {
    dispatch(updateZoomRange(zoomRange));
  },
});
const mergeProps = (stateProps: ROOTSTATE, dispatchProps: any, ownProps: Props) => ({
  ...ownProps,
  zoom: stateProps.zoom,
  updateZoomRange: dispatchProps.updateZoomRange
});

class TimeBar extends React.Component<any, States> {
  arrayPosition: number[] = [];
  leftEndPoint: number = 0;
  rightEndPoint: number = 750;
  originalElementLength: number = 75;

  constructor() {
    super();
    this.state = {
      adjustPos: 0,
      adjustLength: 750,
    };
  }

  drawDate(date: string, position: number, width: number) {
    var svg = d3.select('#date-bar');
    var groupDate = svg.append('g')
                      .attr('class', 'date-element')
                      .attr('transform', 'translate(' + (position + this.leftEndPoint) + ',0)');
    
    groupDate.append('rect')
            .attr('class', 'date-element-bkg')
            .attr('width', width);
    
    groupDate.append('text')
            .attr('class', 'date-element-text')
            .text(date)
            .attr('x', width / 2 - 25)
            .attr('y', 14);          
  }

  drawTimeBar(position: number, width: number) {
    var svg = d3.select('#time-bar');

    var x = d3.scaleLinear()
              .range([0, width])
              .domain([0, 24]);
    
    svg.append('g')
        .attr('class', 'time-element')
        .attr('transform', 'translate(' + (position +  + this.leftEndPoint) + ', 20)')
        .call(d3.axisBottom(x).tickValues([0, 4, 8, 12, 16, 20]));
  }

  drawAdjustBar() {
    var self = this;

    var svg = d3.select('#adjust-bar');

    svg.append('rect')
      .attr('id', 'adjust-pointer')
      .attr('width', this.state.adjustLength)
      .attr('transform', 'translate(' + this.state.adjustPos + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos <= this.leftEndPoint && d3.event.dx < 0) { return; }
          if (self.state.adjustPos + self.state.adjustLength >= this.rightEndPoint && d3.event.dx > 0) { return; }
          self.setState({
            adjustPos: (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
                                  this.leftEndPoint : self.state.adjustPos + d3.event.dx
          });
        }));

    svg.append('rect')
      .attr('id', 'adjust-pointer-left')
      .attr('class', 'adjust-pointer-y')
      .attr('transform', 'translate(' + (this.state.adjustPos - 3) + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos <= this.leftEndPoint && d3.event.dx < 0) { return; }
          self.setState({
            adjustPos: (self.state.adjustPos + d3.event.dx < this.leftEndPoint) ? 
                                this.leftEndPoint : self.state.adjustPos + d3.event.dx,
            adjustLength: self.state.adjustLength - d3.event.dx
          });
        }));

    svg.append('rect')
      .attr('id', 'adjust-pointer-right')
      .attr('class', 'adjust-pointer-y')
      .attr('transform', 'translate(' + (this.state.adjustPos + this.state.adjustLength - 2) + ', 40)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          if (self.state.adjustPos + self.state.adjustLength >= this.rightEndPoint && d3.event.dx > 0) { return; }
          self.setState({
            adjustLength: (self.state.adjustLength + d3.event.dx > this.rightEndPoint) ? 
                              this.rightEndPoint : self.state.adjustLength + d3.event.dx
          });
        }));
  }

  updateAllBar() {
    var self = this;

    d3.select('#adjust-bar').select('#adjust-pointer')
      .attr('width', this.state.adjustLength)
      .attr('transform', 'translate(' + self.state.adjustPos + ', 40)');
    
    d3.select('#adjust-bar').select('#adjust-pointer-left')
      .attr('transform', 'translate(' + (self.state.adjustPos - 3) + ', 40)');

    d3.select('#adjust-bar').select('#adjust-pointer-right')
      .attr('transform', 'translate(' + (self.state.adjustPos + self.state.adjustLength - 2) + ', 40)');

    let newWidth = this.originalElementLength / (this.state.adjustLength) * this.rightEndPoint;
    this.arrayPosition = [];
    for (var i = 0; i < 10; i++) {
      this.arrayPosition.push(i * newWidth);
    }
    
    let listDateElement = d3.select('#date-bar').selectAll('.date-element');
    listDateElement.data(this.arrayPosition)
      .attr('transform', function(d: any){
          return 'translate(' + (d - self.state.adjustPos / self.state.adjustLength * self.rightEndPoint) + ', 0)';
      });
    listDateElement.select('.date-element-bkg').attr('width', newWidth);
    listDateElement.select('.date-element-text').attr('x', newWidth / 2 - 25);
    
    let listTimeElement = d3.select('#time-bar').selectAll('.time-element');
    let x = d3.scaleLinear().range([0, newWidth]).domain([0, 24]);
    listTimeElement.data(this.arrayPosition)
      .attr('transform', function(d: any){
          return 'translate(' 
            + (d - self.state.adjustPos / self.state.adjustLength * self.rightEndPoint - 0.5) + ', 20)';
      })
      .call(d3.axisBottom(x).tickValues([0, 4, 8, 12, 16, 20, 0]));
  }

  componentWillReceiveProps(props: Props) { 
    let dayBetweens = getDatesBetween(new Date(props.startTime), new Date(props.endTime));
    
    for (var i = 0; i < dayBetweens.length; i++) {
      this.arrayPosition.push(i * this.originalElementLength);
      this.drawDate(formatDate(dayBetweens[i]), i * this.originalElementLength, this.originalElementLength);
      this.drawTimeBar(i * this.originalElementLength, this.originalElementLength);
    }
    
    this.drawAdjustBar();
  }

  componentWillUpdate() {
    this.updateAllBar();
  }

  render() {
    return (
      <svg className="time-bar">
        <svg id="date-bar" className="time-bar-element" />
        <svg id="time-bar" className="time-bar-element"/>
        <svg id="adjust-bar" className="time-bar-element"/>
      </svg>
    );
  }
}

// export default TimeBar;
const TimeBarContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(TimeBar);
export default TimeBarContainer;