import * as React from 'react';

import LineChart from './LineChart/LineChart';
import BarChart from './BarChart/BarChart';
import EventChart from './EventChart/EventChart';
import TimelineChart from './TimelineChart/TimelineChart';
import NoteChart from './NoteChart/NoteChart';
import { POINT, EVENT, NOTE } from '../../Interfaces';

import './Track.css';

interface Props {
  type: string;
  name: string;
  title: string;
  title2?: string;
  value: POINT[] | EVENT[] | NOTE[];
  value2?: POINT[] | EVENT[] | NOTE[];
  unit?: string;
  range?: [number, number];
  predict?: boolean;
  color?: string;
  color2?: string;
  position: number;
}

interface States {

}

class Track extends React.Component<Props, States> {

  constructor() {
    super();
  }

  calculatePostionUnit(textLength: number) {
    if (textLength >= 10) {
      return 145;
    } else if (textLength >= 8) {
      return 140;
    } else if (textLength >= 6) {
      return 125;
    } else if (textLength >= 4) {
      return 105;
    } else {
      return 75;
    }
  }

  renderLineChart() {
    return (
      <LineChart 
        name={this.props.name} 
        title={this.props.title} 
        title2={this.props.title2 as string} 
        value={this.props.value as POINT[]}
        value2={this.props.value2 as POINT[]}
        range={this.props.range as [number, number]}
        unit={this.props.unit as string}
        color={this.props.color as string}
        color2={this.props.color2 as string}
        predict={this.props.predict}
        position={50}
      />
    ) ;
  }

  renderBarChart() {
    return (
      <BarChart 
        name={this.props.name} 
        title={this.props.title} 
        title2={this.props.title2 as string} 
        value={this.props.value as POINT[]}
        value2={this.props.value2 as POINT[]}
        unit={this.props.unit as string}
        range={this.props.range as [number, number]}
        color={this.props.color as string}
        color2={this.props.color2 as string}
        predict={this.props.predict}
        position={350}
      />
    );
  }

  renderEventChart() {
    return (
      <EventChart 
        name={this.props.name} 
        title={this.props.title} 
        title2={this.props.title2 as string} 
        value={this.props.value as EVENT[]}
        value2={this.props.value2 as EVENT[]}
        position={650}
      />
    );
  }

  renderNoteChart() {
    return (
      <NoteChart 
        name={this.props.name} 
        title={this.props.title} 
        value={this.props.value as EVENT[]}
        position={650}
      />
    );
  }

  renderTimelineChart() {
    return (
      <TimelineChart name={this.props.name} position={650}/>
    );
  }

  renderHeader() {
    return (
      <g>
        <rect 
          className="track-header"
          width="791px"
          height="40px"
          x="-1"  
          y={this.props.position + 10} 
        />
        <rect 
          width="15"
          height="15"
          x="20"  
          y={this.props.position + 22} 
          fill={this.props.color}
        />
        <text className="track-name" fontWeight="bold" x="40" y={this.props.position + 35} >
          {this.props.title.toLocaleUpperCase()}
        </text>
        { (this.props.title2) ?
          <g> 
            <rect 
              width="15"
              height="15"
              x="180"  
              y={this.props.position + 22} 
              fill={this.props.color2}
            />
            <text className="track-name" fontWeight="bold" x="200" y={this.props.position + 35} >
              {this.props.title2.toLocaleUpperCase()}
            </text>
          </g> : null
        }
        { (this.props.unit) ?
          <text 
            className="track-name" 
            fontWeight="bold" 
            x={(this.props.title2) ? 335 : this.calculatePostionUnit(this.props.title.length)}
            y={this.props.position + 35} 
          >
            ({this.props.unit})
          </text> : null
        }
      </g>
    );
  }

  renderTrackBorder() {
    return (
      <rect 
        className="track-border" 
        x="50" 
        y="20.5" 
        transform="translate(0,0)" 
      />
    );
  }

  renderTrackDrag() {
    return (
      <rect 
        className="track-drag" 
        x="11" 
        y="20.5" 
        transform="translate(0,0)" 
      />
    );
  }

  renderTrackClipPath() {
    return (
      <defs>
      <clipPath id={'clipPath-' + this.props.name}>
        <rect x="0" y="0" width="750" height="100" />
      </clipPath >
      </defs>
    );
  }

  render() {
    let renderComponent = null;
    switch (this.props.type) {
    case 'bar-chart':
        renderComponent = this.renderBarChart();
        break;
    case 'line-chart':
        renderComponent = this.renderLineChart();
        break;
    case 'event-chart':
        renderComponent = this.renderEventChart();
        break;
    case 'timeline-chart':
        renderComponent = this.renderTimelineChart();
        break;
    case 'note-chart':
        renderComponent = this.renderNoteChart();
        break;
    default:
        renderComponent = null;
    }

    return (
      <g className="track-group" >
        {this.renderTrackClipPath()}
        {this.renderHeader()}
        <svg className="track" x="-11" y={this.props.position + 30}>
          {this.renderTrackBorder()}
          {this.renderTrackDrag()}
          {renderComponent}  
        </svg>
      </g>
    );
  }
}
export default Track;