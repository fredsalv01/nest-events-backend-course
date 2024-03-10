import { Event } from './event.entity';

test('Event should be initalized through constructor', () => {
  const event = new Event({
    name: 'test event',
    description: 'test description',
  });

  expect(event).toEqual({
    name: 'test event',
    description: 'test description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  });
});
