import * as React from 'react';
import { Button, Card, Collapse, ListGroup } from 'react-bootstrap';
import { Visit } from '@App/common';
import { getEventComponent } from './EventComponent';

export default class VisitComponent extends React.Component<{ visit: Visit }, { open: boolean }> {
	
  state = {
    open: false
  }

  setOpen(open: boolean) {
    this.setState({open: open})
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toUTCString()
  }

	render() {
		const visit = this.props.visit;
    const events = Array.from(visit.events).reverse();
    return(
			<Card>
				<Card.Body>
					<Card.Title>{this.formatTime(visit.date)}</Card.Title>
					<Card.Text>visit by {visit.caregiver_id}</Card.Text>
				</Card.Body>
        <Button
          href="#"
          onClick={() => this.setOpen(!this.state.open)}
          aria-controls={visit.visit_id}
          aria-expanded={this.state.open}
          variant="outline-info"
        >visit events</Button>
        <Collapse in={this.state.open}>
          <ListGroup className="list-group-flush" id={visit.visit_id}>
            {events.map(getEventComponent)}
          </ListGroup>
        </Collapse>
			</Card>
		);
	}
}

