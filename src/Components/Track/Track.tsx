import * as React from 'react';
// import * as d3 from 'd3';

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
  normalRange1?: [number, number];
  normalRange2?: [number, number];
  predict?: boolean;
  color?: string;
  color2?: string;
  position: number;
  moveTrackCallback?: Function;
  color3?: string;
  color4?: string;
  value3?: POINT[] | EVENT[] | NOTE[];
  value4?: POINT[] | EVENT[] | NOTE[];
  secondTimeRange?: any;
  id2?: any;
}

interface States {
  isSetting: boolean;
  isGrid: boolean;
  isNormal1: boolean;
  isNormal2: boolean;
  isShade1: boolean;
  isShade2: boolean;
}

class Track extends React.Component<Props, States> {

  constructor() {
    super();

    this.state = {
      isSetting: false,
      isGrid: false,
      isNormal1: false,
      isNormal2: false,
      isShade1: false,
      isShade2: false
    };
  }

  componentDidMount() {
    var self = this;
    window.addEventListener('click', (e) => { 
      if (e.toElement.id !== 'setting-icon-' + self.props.name) {
        self.setState({isSetting: false}); 
      }
    });
  }

  componentWillUnmount() {
    var self = this;
    window.removeEventListener('click', (e) => { 
      self.setState({isSetting: false}); 
    });
  }

  calculatePostionUnit(textLength: number) {
    if (textLength >= 11) {
      return 175;
    } else if (textLength >= 10) {
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
        isGrid={this.state.isGrid}
        isNormal1={this.state.isNormal1}
        isNormal2={this.state.isNormal2}
        isShade1={this.state.isShade1}
        isShade2={this.state.isShade2}
        normalRange1={this.props.normalRange1}
        normalRange2={this.props.normalRange2}
        position={50}
        value3={this.props.value3 as POINT[]}
        value4={this.props.value4 as POINT[]}
        color3={this.props.color3 as string}
        color4={this.props.color4 as string}
        secondTimeRange={this.props.secondTimeRange}
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
        isGrid={this.state.isGrid}
        isNormal1={this.state.isNormal1}
        isNormal2={this.state.isNormal2}
        normalRange1={this.props.normalRange1}
        normalRange2={this.props.normalRange2}
        position={350}
        value3={this.props.value3 as POINT[]}
        value4={this.props.value4 as POINT[]}
        secondTimeRange={this.props.secondTimeRange}
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
        color={this.props.color as string}
        color2={this.props.color2 as string}
        position={650}
        value3={this.props.value3 as EVENT[]}
        value4={this.props.value4 as EVENT[]}
        secondTimeRange={this.props.secondTimeRange}
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
        value2={this.props.value2 as EVENT[]}
        secondTimeRange={this.props.secondTimeRange}
        id2={this.props.id2}
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
          width="781px"
          height="40px"
          x="-1"  
          y={this.props.position + 10} 
        />
        {(!this.props.color3) ? 
          <rect 
            width="15"
            height="15"
            x="20"  
            y={this.props.position + 22} 
            fill={this.props.color}
          /> : 
          <g>
            <rect 
              width="7.5"
              height="15"
              x="20"  
              y={this.props.position + 22} 
              fill={this.props.color}
            />
            <rect 
              width="7.5"
              height="15"
              x="27.5"  
              y={this.props.position + 22} 
              fill={this.props.color3}
            />
          </g>
        }
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

  renderGridIcon() {
    return (
      <g>
        {/* <image 
          className="grid-icon"
          xlinkHref={require('./img/grid.png')}
          width="25"
          height="25"
          x="725"
          y={this.props.position + 18}
        /> */}
        <rect 
          className="grid-icon"
          fill="#444faf"
          rx="5" 
          ry="2"
          width="55"
          height="25"
          x="645"
          y={this.props.position + 18}
          onMouseDown={() => {
            this.setState({isGrid: !this.state.isGrid});
          }}
        />
        <text 
          className="grid-icon grid-icon-text" 
          x="657" 
          y={this.props.position + 35} 
          fill="white"
          onMouseDown={() => {
            this.setState({isGrid: !this.state.isGrid});
          }}
        >
          GRID
        </text>
      </g>
    );
  }

  renderSettingIcon() {
    let startPosition = 525;
    let tableWidth = 220;

    let renderItem = (title: string, color: string, textPosition: number, iconPosition: number, callback: any) => {
      return (
        <g>
          <text 
            className="setting-text" 
            x={startPosition + 15}
            y={this.props.position + textPosition} 
          >
            {title}
          </text>
          <rect 
            fill={color}
            width="10"
            height="30"
            x={startPosition}
            y={this.props.position + iconPosition}
          />
          <rect 
            className="setting-choice"
            rx="5" 
            ry="2"
            width={tableWidth}
            x={startPosition}
            y={this.props.position + iconPosition}
            onMouseDown={callback}
          />
        </g>
      );
    };

    return (
      <g>
        <image 
          className="setting-icon"
          id={'setting-icon-' + this.props.name}
          width="55"
          height="25"
          xlinkHref={require('./img/menu.png')}
          x="705"
          y={this.props.position + 18}
          onClick={() => {
            this.setState({isSetting: true});
          }}
        />

        {(this.state.isSetting) ? <g>
          <rect 
            className="setting-table"
            id={'setting-table-' + this.props.name}
            rx="5" 
            ry="2"
            width={tableWidth}
            height={(this.props.title2) ? '120' : '60'}
            x={startPosition}
            y={this.props.position + 18}
          />
          {renderItem(this.props.title + ' normal range', this.props.color as string, 38, 17, () => {
            this.setState({
              isNormal1: !this.state.isNormal1,
              isNormal2: false,
            });
          })}
          {(this.props.title2) ? <g>
            {renderItem(this.props.title2 + ' normal range', this.props.color2 as string, 68, 47, () => {
              this.setState({
                isNormal2: !this.state.isNormal2,
                isNormal1: false,
              });
            })}
            {renderItem(this.props.title + ' shading', this.props.color as string, 97, 76, () => {
              this.setState({
                isShade1: !this.state.isShade1,
                isShade2: false,
              });
            })}
            {renderItem(this.props.title2 + ' shading', this.props.color2 as string, 127, 106, () => {
              this.setState({
                isShade2: !this.state.isShade2,
                isShade1: false,
              });
            })}
          </g> : <g>
            {renderItem(this.props.title + ' shading', this.props.color as string, 68, 47, () => {
              this.setState({
                isShade1: !this.state.isShade1,
                isShade2: false,
              });
            })}
          </g>}
        </g> : null}
      </g>
    );
  }

  renderMoveTrackIcon() {
    // points={this.props.position + ',30 ' + (this.props.position + 10) + ',0 ' + (this.props.position + 20) + ',30'} 
    var positionTop = this.props.position + 28;
    var positionBot = this.props.position + 32;
    return (
      <g>
        <polygon 
          className="move-track-icon move-up-track"
          fill="white"
          stroke="white" 
          points={'760,' + positionTop + ' 765,' + (positionTop - 10) + ' 770,' + positionTop} 
          onMouseDown={() => {
            if (this.props.moveTrackCallback) {
              this.props.moveTrackCallback(this.props.name, 'up');
            }
          }}
        />
        <polygon 
          className="move-track-icon move-down-track"
          fill="white"
          stroke="white" 
          points={'760,' + positionBot + ' 765,' + (positionBot + 10) + ' 770,' + positionBot} 
          onMouseDown={() => {
            if (this.props.moveTrackCallback) {
              this.props.moveTrackCallback(this.props.name, 'down');
            }
          }}
        />
      </g>
    );
  }

  renderTrackBackground() {
    return (
      <rect 
        className="track-background" 
        x="40" 
        y={this.props.position + 50} 
        transform="translate(0,0)" 
      />
    );
  }

  renderTrackBorder() {
    return (
      <g className="track-border-group">
        {/* <rect 
          className="track-border" 
          x="50" 
          y="20.5" 
          transform="translate(0,0)" 
        /> */}
        <rect 
          className="track-border" 
          x="50" 
          y="20.5" 
          transform="translate(0,0)" 
        />
        {/* {(this.props.name.includes('Top')) ?
          <rect 
            className="track-border-side" 
            x="50" 
            y="123" 
            transform="translate(0,0)" 
          /> 
        : null} */}
      </g>
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
        <rect x="0" y="0" width="740" height="100" />
      </clipPath >
      </defs>
    );
  }

  render() {
    let renderComponent = null;
    let isGridAndRange = true;
    switch (this.props.type) {
    case 'bar-chart':
        renderComponent = this.renderBarChart();
        break;
    case 'line-chart':
        renderComponent = this.renderLineChart();
        break;
    case 'event-chart':
        renderComponent = this.renderEventChart();
        isGridAndRange = false;
        break;
    case 'timeline-chart':
        renderComponent = this.renderTimelineChart();
        isGridAndRange = false;
        break;
    case 'note-chart':
        renderComponent = this.renderNoteChart();
        isGridAndRange = false;
        break;
    default:
        renderComponent = null;
    }

    return (
      <g className="track-group" >
        {this.renderTrackClipPath()}
        {this.renderHeader()}
        
        {this.renderMoveTrackIcon()}
        {this.renderTrackBackground()}
        <svg className="track" x="-11" y={this.props.position + 30}>
          {this.renderTrackBorder()}
          {this.renderTrackDrag()}
          {renderComponent}  
        </svg>
        {(isGridAndRange) ? this.renderGridIcon() : null}}
        {(isGridAndRange) ? this.renderSettingIcon() : null}
        {/* {(isGridAndRange) ? this.renderNormalIcon() : null}
        {(isGridAndRange) ? this.renderGridIcon() : null} */}
        
      </g>
    );
  }
}
export default Track;