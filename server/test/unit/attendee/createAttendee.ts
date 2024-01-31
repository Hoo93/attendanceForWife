import { Attendee } from '../../../src/attendees/entities/attendee.entity';

export function createAttendee(name, attendanceId, description, age, createId) {
  const attendee = new Attendee();
  attendee.name = name;
  attendee.attendanceId = attendanceId;
  attendee.description = description;
  attendee.age = age;
  attendee.createId = createId;
  return attendee;
}
