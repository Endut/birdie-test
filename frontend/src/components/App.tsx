import React from 'react';

import { Visit, Event } from 'common';
import VisitComponent from './VisitComponent';
import { MoodChart } from './MoodChart';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { RootState } from '../store/reducers/index'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';

import { setStartDate, setEndDate, DateActionType } from '../store/actions/dateActions';
import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '../store/actions/visitActions';

import 'react-datepicker/dist/react-datepicker.css';
import { fetchVisits } from '../api';


interface AppProps {
  fetchVisitsBegin: (apiCredentials: any, startDate: Date, endDate: Date) => AnyAction,
  fetchVisitsSuccess: (visits: Visit[]) => AnyAction,
  fetchVisitsError: (error: Error) => AnyAction
  setStartDate: (date: Date) => DateActionType,
  setEndDate: (date: Date) => DateActionType,
  startDate: Date,
  endDate: Date,
  visits: Visit[],
  events: Event[]
}

class App extends React.Component<AppProps, {}> {

  componentDidMount() {
    fetchVisits(this.props.startDate, this.props.endDate)
      .then((data) => {
        console.log(data)
        this.props.fetchVisitsSuccess(data);
      })
  }
	
  render() {

    return (
      // <Router>
        <div className="App">
          <Container>
            <Row>
              <Col>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={this.props.startDate}
                  onChange={this.props.setStartDate}
                />
              </Col>
              <Col>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={this.props.endDate}
                  onChange={this.props.setEndDate}
                />
              </Col>
            </Row>
            <Tabs defaultActiveKey="visits" id="tabs">
              <Tab eventKey="visits" title="Visits">
              {this.props.visits.map((visit: Visit) => 
                <VisitComponent visit={visit} key={visit.visit_id} />
                )}
              </Tab>
              <Tab eventKey="moodChart" title="Mood Chart">
                <MoodChart events={this.props.events} />
              </Tab>
            </Tabs>
          </Container>
        </div>
      // </Router>
    );
  }
}


function getRelevantVisits(visits: Visit[], startDate: Date, endDate: Date): Visit[] {
  return visits.filter((visit: Visit) => {
    return (new Date(visit.date).getTime() <= endDate.getTime())
      && (new Date(visit.date).getTime() >= startDate.getTime())
    });
}

function getRelevantEvents(visits: Visit[], startDate: Date, endDate: Date): Event[] {
  return getRelevantVisits(visits, startDate, endDate)
    .map(visit => visit.events.filter(event => event.event_type === 'mood_observation'))
    .reduce((a, b) => a.concat(b), []);
}


const mapStateToProps = (state: RootState, ownProps: object) => {
  const { visits, startDate, endDate } = state;
  return {
    visits: getRelevantVisits(visits, startDate, endDate),
    events: getRelevantEvents(visits, startDate, endDate),
    startDate, endDate }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    setStartDate: (date: Date) => {
      console.log('dispatch and fetch new data here also?');
      return dispatch(setStartDate(date));
    },
    setEndDate: (date: Date) => {
      console.log('dispatch and fetch new data here also?');
      return dispatch(setEndDate(date));
    },
    fetchVisitsBegin: (apiCredentials: any, startDate: Date, endDate: Date) => {
      return dispatch(fetchVisitsBegin(apiCredentials, startDate, endDate));
    },
    fetchVisitsSuccess: (visits: Visit[]) => dispatch(fetchVisitsSuccess(visits)),
    fetchVisitsError: (error: Error) => dispatch(fetchVisitsError(error))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


// setStart(date: Date) {
//   this.setState((prevState, props) => {
//     const prevFirstVisitDate = new Date(prevState.visits[prevState.visits.length - 1].date);
//     if (date.getTime() < prevFirstVisitDate.getTime()) {;
//       this.fetchVisits(date, prevState.startDate)
//         .then(data => {
//           this.setState((prevState, props) => {
//             const oldVisits = prevState.visits;
//             return { visits: oldVisits.concat(data) }
//           })
//         })
//     }
//     return { startDate: date };
//   })
// }

// setEnd(date: Date) {
//   this.setState((prevState, props) => {
//     const prevLastVisitDate = new Date(prevState.visits[0].date);
//     if (date.getTime() > prevLastVisitDate.getTime()) {;
//       this.fetchVisits(prevState.endDate, date)
//         .then(data => {
//           this.setState((prevState, props) => {
//             const oldVisits = prevState.visits;
//             return { visits: data.concat(oldVisits) }
//           })
//         })
//     }
//     return { endDate: date };
//   })
// }

