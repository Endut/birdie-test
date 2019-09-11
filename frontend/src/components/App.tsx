import React from 'react';

import { Visit, Event } from 'common';
import VisitComponent from './VisitComponent';
import { MoodChart } from './MoodChart';
import { LoadingIndicator } from './LoadingIndicator';
import { Container, Collapse, Row, Col, Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { RootState } from '../store/reducers/index'
import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';

import { setStartDate, setEndDate, DateActionType } from '../store/actions/dateActions';
import { fetchVisitsBegin } from '../store/actions/visitActions';

import 'react-datepicker/dist/react-datepicker.css';


interface AppProps {
  fetchVisitsBegin: (id: string, startDate: Date, endDate: Date) => AnyAction,
  setStartDate: (date: Date) => DateActionType,
  setEndDate: (date: Date) => DateActionType,
  isLoading: boolean,
  startDate: Date,
  endDate: Date,
  visits: Visit[],
  events: Event[],
  care_recipient_id: string
}

class App extends React.Component<AppProps, {}> {

  componentDidMount() {
    this.props.fetchVisitsBegin(this.props.care_recipient_id, this.props.startDate, this.props.endDate);
    // fetchVisitsFromApi(this.props.care_recipient_id, this.props.startDate, this.props.endDate)
    //   .then((data) => {
    //     this.props.fetchVisitsSuccess(data);
    //   })
  }

	
  render() {
    return (
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
            <Collapse in={this.props.isLoading}>
              <Row className="justify-content-md-center">
                <LoadingIndicator />
              </Row>
            </Collapse>
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

const mapStateToProps = (state: RootState, ownProps: any) => {
  const { visitsState, startDate, endDate } = state;
  return {
    visits: getRelevantVisits(visitsState.visits, startDate, endDate),
    events: getRelevantEvents(visitsState.visits, startDate, endDate),
    isLoading: visitsState.isLoading,
    care_recipient_id: ownProps.match.params.care_recipient_id,
    startDate, endDate }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    setStartDate: (date: Date) => dispatch(setStartDate(date)),
    setEndDate: (date: Date) => dispatch(setEndDate(date)),
    fetchVisitsBegin: (id: string, startDate: Date, endDate: Date) => dispatch(fetchVisitsBegin(id, startDate, endDate)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
