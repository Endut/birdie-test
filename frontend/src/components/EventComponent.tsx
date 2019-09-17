import * as React from 'react';
import { Card, ListGroupItem } from 'react-bootstrap';
import { Event } from '@App/common';
import { EventTypeEmoji } from '@App/renderEnums';
import { Twemoji as Emoji } from 'react-emoji-render';

function leftPadTime(time: number): string {
  return (0 + String(time)).slice(-2);
}

function snakeToLowerCase(string: string): string {
  return string.replace(/_/g, ' ');
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return `${leftPadTime(date.getUTCHours())}:${leftPadTime(date.getUTCMinutes())}:${leftPadTime(date.getUTCSeconds())}`;
}


export class EventComponent extends React.Component<{ event: Event }, {}> {
	
	render() {
    const event = this.props.event;

    const time = formatTime(this.props.event.timestamp);

    let subTitle = snakeToLowerCase(event.event_type);

    let emoji = EventTypeEmoji[event.event_type];
    if (emoji !== undefined) {
      subTitle = `${emoji} ${subTitle}`;
    }

    const note = this.props.children || <Card.Text>{event.payload.note}</Card.Text>

    return(
      <ListGroupItem key={event.id}>
        <Card>
          <Card.Body>
            <Card.Title>{time}</Card.Title>
            <Card.Subtitle
              className="text-muted"
            ><Emoji text={subTitle} />
            </Card.Subtitle>
            {note}
           </Card.Body>
        </Card>
      </ListGroupItem>
			);
	}
}

export class FluidEvent extends React.Component<{ event: Event }, {}> {
  render() {
    const event = this.props.event;
    const note =
      <Card.Text>
        {event.payload.consumed_volume_ml} ml - ({event.payload.fluid} drink)
      </Card.Text>;
    return(<EventComponent event={this.props.event} children={note}/>);
  }
}

export class MoodEvent extends React.Component<{ event: Event }, {}> {
  render() {
    const event = this.props.event;
    const note = (
      <>
        <Card.Text>
          {event.payload.mood}
        </Card.Text>
        {event.payload.note ? 
          <Card.Text>
            {event.payload.mood}
          </Card.Text>
          : null}
      </>
    );
    return(<EventComponent event={this.props.event} children={note}/>);
  }
}

export class PadEvent extends React.Component<{ event: Event }, {}> {
  render() {
    const event = this.props.event;
    const note = (
      <>
        <Card.Text>
          {event.payload.note}
        </Card.Text>
        {event.payload.pad_condition ? 
          <Card.Text>
            {event.payload.pad_condition}
          </Card.Text>
          : null}
      </>
    );
    return(<EventComponent event={this.props.event} children={note}/>);
  }
}

export class TaskEvent extends React.Component<{ event: Event }, {}> {
  render() {
    const event = this.props.event;
    const note = (
      <>
        <Card.Text>
          task description: {event.payload.task_definition_description}
        </Card.Text>
        {event.payload.task_schedule_note ? 
          <Card.Text>
            note from care recipient: {event.payload.task_schedule_note}
          </Card.Text>
        : null}
      </>
    );
    return(<EventComponent event={this.props.event} children={note}/>);
  }
}

export function getEventComponent(event: Event): JSX.Element {
  switch(event.event_type) {
    case 'fluid_intake_observation': return <FluidEvent event={event} key={event.id}/>;
    case 'mood_observation': return <MoodEvent event={event} key={event.id}/>;
    case 'incontinence_pad_observation': return <PadEvent event={event} key={event.id}/>
    case 'task_completed': return <TaskEvent event={event} key={event.id}/>
    case 'task_completion_reverted': return <TaskEvent event={event} key={event.id}/>
    default: return <EventComponent event={event} key={event.id}/>
  }
}
