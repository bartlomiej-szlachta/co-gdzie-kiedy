import React, {Component} from 'react';
import SoftwareDetailsComponent from './SoftwareDetailsComponent';
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";
import moment from "moment";

class SoftwareDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      key: '',
      availableKeys: '',
      duration: '',
      validationStatus: false,
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
    if(this.props.mode === 'edit')
      this.getDataForEditCall();
  }

  addCall = () => {
    let currentDate = new Date();
    let endDate = moment(currentDate).add(this.state.duration, 'month');
    let duration = endDate - currentDate; //to poleci jsonem

    let months = 12 * (moment(duration).year() - moment(0).year()); //sumujemy jesli jest >= 12 msc.
    console.log(moment(duration).month() + months); // to jest wynik ostateczny msc'y

    fetch('http://localhost:8080/api/software',{
      method: 'POST',
      body: JSON.stringify({
        "name": this.state.name,
        "key": this.state.key,
        "availableKeys": this.state.availableKeys,
        "duration": duration
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getDataForEditCall(){
    fetch(`http://localhost:8080/api/software/${this.props.id}`)
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            name: responseJson.name,
            key: responseJson.key,
            availableKeys: responseJson.availableKeys,
            duration: responseJson.duration,
        });
        })
  };

  onSubmit = () => this.addCall();
  onReject = () => this.props.goBack();
  setName = (value) => {this.setState({name: value});};
  setKey = (value) => this.setState( {key: value});
  setAvailableKeys = (value) => this.setState({availableKeys: value});
  setDuration = (value) => this.setState({duration: value});;

  render() {
    return (
      <SoftwareDetailsComponent
        setText={this.setText}
        onSubmit={this.onSubmit}
        onReject={this.onReject}
        setName={this.setName}
        setKey={this.setKey}
        setAvailableKeys={this.setAvailableKeys}
        setDuration={this.setDuration}
        mode={this.props.mode}
        name={this.state.name}
        keY={this.state.key}
        availableKeys={this.state.availableKeys}
        duration={this.state.duration}
        validationStatus={!isEmpty(this.state.name) && !isEmpty(this.state.key) &&
                          !isEmpty(this.state.availableKeys) && !isEmpty(this.state.duration)}
      />
    );
  }
}

export default SoftwareDetailsContainer;
