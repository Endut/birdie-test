import * as React from 'react';

import { Visit, Event } from 'common';
import VisitComponent from '../VisitComponent';
import { MoodChart } from '../MoodChart';
import { LoadingIndicator } from '../LoadingIndicator';
import { Container, Collapse, Row, Col, Tab, Tabs } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RootState } from '@App/store/reducers/index';
import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';

import { setStartDate, setEndDate } from '@App/store/actions/dateActions';
import { fetchVisitsBegin } from '@App/store/actions/visitActions';

import { filterVisits, filterEvents } from '@App/store/selectors';


interface AppProps {
  fetchVisitsBegin: (id: string, startDate: Date, endDate: Date) => AnyAction;
  setStartDate: (date: Date) => AnyAction;
  setEndDate: (date: Date) => AnyAction;
  isLoading: boolean;
  startDate: Date;
  endDate: Date;
  visits: Visit[];
  mood_events: Event[];
  care_recipient_id: string;
}

export class App extends React.Component<AppProps, {}> {

  componentDidMount() {
    this.props.fetchVisitsBegin(this.props.care_recipient_id, this.props.startDate, this.props.endDate);
  }

  render() {
    const { mood_events, visits, isLoading, startDate, endDate, setStartDate, setEndDate } = this.props;
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={setStartDate}
              />
            </Col>
            <Col>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={endDate}
                onChange={setEndDate}
              />
            </Col>
          </Row>
          <Tabs defaultActiveKey="visits" id="tabs" mountOnEnter={true}>
            <Tab eventKey="visits" title="Visits">
            <Collapse in={isLoading}>
              <Row className="justify-content-md-center">
                <LoadingIndicator />
              </Row>
            </Collapse>
            {
              visits.reverse().map((visit: Visit) =>
                <VisitComponent visit={visit} key={visit.visit_id} />
              )
            }
            </Tab>
            <Tab eventKey="moodChart" title="Mood Chart">
              <MoodChart events={mood_events} />
            </Tab>
          </Tabs>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: any) => {
  const { visitsState, startDate, endDate } = state;
  const visits = filterVisits(state);
  return {
    visits: visits,
    mood_events: filterEvents(state, 'mood_observation'),
    isLoading: visitsState.isLoading,
    care_recipient_id: ownProps.match.params.care_recipient_id,
    startDate,
    endDate
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    setStartDate: (date: Date) => dispatch(setStartDate(date)),
    setEndDate: (date: Date) => dispatch(setEndDate(date)),
    fetchVisitsBegin: (id: string, startDate: Date, endDate: Date) => dispatch(fetchVisitsBegin(id, startDate, endDate)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
