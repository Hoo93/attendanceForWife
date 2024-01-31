import { Attendee } from '../../../src/attendees/entities/attendee.entity';

export function createSimpleAttendee(name, attendanceId, createId) {
  const attendee = new Attendee();
  attendee.name = name;
  attendee.attendanceId = attendanceId;
  attendee.createId = createId;
  return attendee;
}
