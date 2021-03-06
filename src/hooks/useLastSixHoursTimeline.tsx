import { useEffect, useState } from 'react';

import {
  getActivityTimeline,
  TimelineRecord,
} from '../background/storage/timelines';
import { getHoursInMs, getIsoDate } from '../shared/dates-helper';

export const useLastSixHoursTimelineEvents = () => {
  const [activityEvents, setActivityEvents] = useState<TimelineRecord[]>([]);

  useEffect(() => {
    (async () => {
      const timeline = await getActivityTimeline(getIsoDate(new Date()));
      const sixHoursAgo = Date.now() - getHoursInMs(6);

      const events = timeline.filter(
        (event) => event.activityPeriodStart > sixHoursAgo
      );

      setActivityEvents(events);
    })();
  }, []);

  return activityEvents;
};
