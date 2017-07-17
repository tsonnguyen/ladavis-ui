import * as React from 'react';
import * as d3 from 'd3';

import './TimeBar.css';

interface TimeBarProps {
  position: number;
}

interface TimeBarState {
  adjustPos: number;
}

class TimeBar extends React.Component<TimeBarProps, TimeBarState> {
  arrayPosition: number[] = [];
  constructor() {
    super();
    this.state = {
      adjustPos: 0
    };
  }

  drawDate(position: number) {
    var svg = d3.select('#date-bar');
    var groupDate = svg.append('g')
                      .attr('class', 'date-element')
                      .attr('transform', 'translate(' + position + ',0)');
    
    groupDate.append('rect')
            .attr('class', 'date-element-bkg');
    
    groupDate.append('text')
            .attr('class', 'date-element-text')
            .text('17/07/2013')
            .attr('x', 50)
            .attr('y', 14);          
  }

  drawTimeBar(position: number) {
    var svg = d3.select('#time-bar');

    var x = d3.scaleLinear()
              .range([0, 150])
              .domain([0, 24]);
    
    svg.append('g')
        .attr('class', 'time-element')
        .attr('transform', 'translate(' + position + ',0)')
        .call(d3.axisBottom(x)
                .tickValues([0, 4, 8, 12, 16, 20]));
  }

  drawAdjustBar(width: number) {
    var self = this;

    var svg = d3.select('#adjust-bar');

    svg.append('rect')
      .attr('class', 'adjust-pointer')
      .attr('width', width)
      .attr('transform', 'translate(' + this.state.adjustPos + ',0)')
      .call(d3.drag()
        .on('drag', (d: any) => {
          self.setState({
            adjustPos: self.state.adjustPos + d3.event.dx
          });
        }));
  }

  updateAllBar() {
    var self = this;

    d3.select('#adjust-bar').select('rect')
      .attr('transform', 'translate(' + self.state.adjustPos + ',0)');

    d3.select('#date-bar').selectAll('.date-element')
        .data(this.arrayPosition)
        .attr('transform', function(d: any){
            return 'translate(' + (d - self.state.adjustPos) + ',0)';
        });
    
    d3.select('#time-bar').selectAll('.time-element')
        .data(this.arrayPosition)
        .attr('transform', function(d: any){
            return 'translate(' + (d - self.state.adjustPos) + ',0)';
        });
  }

  componentDidMount() {
    for (var i = 0; i < 2000; i += 150) {
      this.arrayPosition.push(i);
      this.drawDate(i);
      this.drawTimeBar(i);
    }
    this.drawAdjustBar(100);
  }

  componentWillUpdate() {
    this.updateAllBar();
  }

  render() {
    return (
      <div className="time-bar" style={{top: this.props.position}}>
        <svg id="date-bar" className="time-bar-element"/>
        <svg id="time-bar" className="time-bar-element"/>
        <svg id="adjust-bar" className="time-bar-element"/>
      </div>
    );
  }
}
export default TimeBar;