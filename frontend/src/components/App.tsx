import React from 'react';
import { Visit, Event } from 'common';
import VisitComponent from './VisitComponent';
import { MoodChart } from './MoodChart';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';

import { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError } from '../store/actions/index';

import 'react-datepicker/dist/react-datepicker.css';

const CARE_RECIPIENT_ID = 'df50cac5-293c-490d-a06c-ee26796f850d';
const URL = 'http://localhost:8000/api/v1/care_recipients';

interface AppProps {
  fetchVisitsBegin: () => AnyAction,
  fetchVisitsSuccess: () => AnyAction,
  fetchVisitsError: () => AnyAction
}

// interface AppState {
//   visitIDs: string[],
//   visits: Map<string, Visit>,
//   startDate: Date,
//   endDate: Date
// }

interface AppState {
  visits: Visit[],
  startDate: Date,
  endDate: Date
}

class App extends React.Component<AppProps, AppState> {
	
  constructor(props: AppProps) {
    super(props);
    
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1)
    
    // this.state = {
    //   visitIDs: [],
    //   visits: new Map<string, Visit>()
    //   startDate: startDate,
    //   endDate: endDate
    // };

  }

  async fetchVisits(timeFrom: Date, timeTo: Date): Promise<Visit[]> {
    return fetch(`${URL}/${CARE_RECIPIENT_ID}/visits/?timeFrom=${timeFrom.toISOString()}&timeTo=${timeTo.toISOString()}`)
      .then(res => res.json())
  }

  handleFetchVisitsBegin = () => {
    this.props.fetchVisitsBegin();
  }

  handleFetchVisitsSuccess = () => {
    this.props.fetchVisitsSuccess();
  }

  componentDidMount() {
    this.fetchVisits(this.state.startDate, this.state.endDate)
      .then((data) => {
        this.setState({ visits: data });
      })
  }

  setStart(date: Date) {
    this.setState((prevState, props) => {
      const prevFirstVisitDate = new Date(prevState.visits[prevState.visits.length - 1].date);
      if (date.getTime() < prevFirstVisitDate.getTime()) {;
        this.fetchVisits(date, prevState.startDate)
          .then(data => {
            this.setState((prevState, props) => {
              const oldVisits = prevState.visits;
              return { visits: oldVisits.concat(data) }
            })
          })
      }
      return { startDate: date };
    })
  }

  setEnd(date: Date) {
    this.setState((prevState, props) => {
      const prevLastVisitDate = new Date(prevState.visits[0].date);
      if (date.getTime() > prevLastVisitDate.getTime()) {;
        this.fetchVisits(prevState.endDate, date)
          .then(data => {
            this.setState((prevState, props) => {
              const oldVisits = prevState.visits;
              return { visits: data.concat(oldVisits) }
            })
          })
      }
      return { endDate: date };
    })
  }

  getRelevantVisits(): Visit[] {
    return this.state.visits.filter((visit: Visit) => {
      return (new Date(visit.date).getTime() <= this.state.endDate.getTime())
        && (new Date(visit.date).getTime() >= this.state.startDate.getTime())
      });
  }

  getRelevantEvents(): Event[] {
    return this.getRelevantVisits()
      .map(visit => visit.events.filter(event => event.event_type === 'mood_observation'))
      .reduce((a, b) => a.concat(b), []);
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
                  selected={this.state.startDate}
                  onChange={this.setStart.bind(this)}
                />
              </Col>
              <Col>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={this.state.endDate}
                  onChange={this.setEnd.bind(this)}
                />
              </Col>
            </Row>
            <Tabs defaultActiveKey="visits" id="tabs">
              <Tab eventKey="visits" title="Visits">
        	      {this.getRelevantVisits().map((visit: Visit) => 
                  // <Route
                  //   path={`/visits/${visit.visit_id}`}
                  //   component={RoutedVisit}
                  // />
                  <VisitComponent visit={visit} key={visit.visit_id} />
                  )}
              </Tab>
              <Tab eventKey="moodChart" title="Mood Chart">
                <MoodChart events={this.getRelevantEvents()} />
              </Tab>
            </Tabs>
          </Container>
        </div>
      // </Router>
    );
  }
}

// export default App

const mapStateToProps = (state: AppState, ownProps: object) => {};

// const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {};

export default connect(mapStateToProps, { fetchVisitsBegin, fetchVisitsSuccess, fetchVisitsError })(App);
