import * as React from 'react';
import './SwitchButton.css';

interface Props {
  isChecked: boolean;
  callback: Function;
}

interface States {
  isChecked: boolean;
}

export default class SwitchButton extends React.Component<Props, States> {
  constructor (props: Props) {
    super(props);
  
    this.state = {
      isChecked: false
    };
  }
    
  componentWillMount () {
    this.setState( { isChecked: this.props.isChecked } );
  }

  render () {
    return(
      <div className="switch-container">
        <label>
          <input 
            // tslint:disable-next-line:jsx-no-string-ref
            ref = "switch"
            checked = {this.state.isChecked} 
            onChange = {this._handleChange} 
            className = "switch" 
            type = "checkbox" 
          />
          <div>
            <span><g className="icon icon-toolbar grid-view"/></span>
            <span><g className="icon icon-toolbar ticket-view"/></span>
            <div/>
          </div>
        </label>
      </div>
    );
  }
  
  _handleChange = () => {
    let newState = !this.state.isChecked;
    this.setState({ 
      isChecked: newState
    });
    let self = this;
    setTimeout(function() { self.props.callback(newState); }, 300);
  }
  
}
  