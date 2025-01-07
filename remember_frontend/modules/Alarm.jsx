import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';


async function requestCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Calendar permissions not granted.');
  }
}

async function getOrCreateCalendar() {
  const calendars = await Calendar.getCalendarsAsync();

  const existingCalendar = calendars.find((cal) => cal.title === 'My Alarm Calendar');
  if (existingCalendar) {
    return existingCalendar.id;
  }

  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await Calendar.getDefaultCalendarSourceAsync()
      : { isLocalAccount: true, name: 'Expo Calendar' };

  const newCalendarId = await Calendar.createCalendarAsync({
    title: 'Check Remember.io',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    source: defaultCalendarSource,
    name: 'MyAlarmCalendar',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    ownerAccount: 'personal',
  });

  console.log(`New calendar created with ID: ${newCalendarId}`);
  return newCalendarId;
}

async function scheduleAlarm(hour, minute) {
  try {
    await requestCalendarPermissions();

    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hour, minute, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const calendarId = await getOrCreateCalendar();

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: 'Check Remember.io',
      startDate: alarmTime,
      endDate: new Date(alarmTime.getTime() + 600000), 
      timeZone: 'GMT+6',
      alarms: [{ relativeOffset: 0 }, {relativeOffset: -5}, {method: "alert"}], 
    });

    console.log(`Alarm scheduled for ${alarmTime} with event ID: ${eventId}`);
    return { success: true, eventId };
  } catch (error) {
    console.error('Error scheduling alarm:', error.message);
    return { success: false, error: error.message };
  }
}

export default {
  scheduleAlarm,
};