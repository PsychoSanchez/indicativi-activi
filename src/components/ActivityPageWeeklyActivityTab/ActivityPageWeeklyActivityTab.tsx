import * as React from 'react';

import { AppStore } from '../../hooks/useTimeStore';
import { getTotalWeeklyActivity } from '../../selectors/get-total-weekly-activity';
import { get7DaysPriorDate, getIsoDate } from '../../shared/dates-helper';

import { ActivityTable } from '../ActivityTable/ActivityTable';
import { TimeUsage } from '../DailyTimeUsage/DailyTimeUsage';
import { Panel } from '../Panel/Panel';
import { WeeklyWebsiteActivityChart } from '../WeeklyWebsiteActivityChart/WeeklyWebsiteActivityChart';

import { ActivityPageWeeklyActivityTabProps } from './types';

export const ActivityPageWeeklyActivityTab: React.FC<ActivityPageWeeklyActivityTabProps> =
  ({ store, sundayDate }) => {
    const [pickedDomain, setPickedDomain] = React.useState<null | string>(null);

    const handleDomainRowClick = React.useCallback((domain: string) => {
      setPickedDomain(domain);
      window.scrollTo(0, 0);
    }, []);

    const allWeekActivity = React.useMemo(
      () =>
        get7DaysPriorDate(sundayDate).reduce((acc, date) => {
          const isoDate = getIsoDate(date);
          acc[isoDate] = store[isoDate] || {};

          return acc;
        }, {} as AppStore),
      [store, sundayDate]
    );

    const filteredWebsiteWeekActivity = React.useMemo(() => {
      if (pickedDomain === null) {
        return allWeekActivity;
      }

      return Object.entries(allWeekActivity).reduce(
        (acc, [date, dateWebsitesUsage]) => {
          acc[date] = {
            [pickedDomain]: dateWebsitesUsage[pickedDomain] || 0,
          };

          return acc;
        },
        {} as typeof allWeekActivity
      );
    }, [allWeekActivity, pickedDomain]);

    const totalWebsiteWeeklyActivity = React.useMemo(
      () =>
        Object.values(allWeekActivity).reduce((acc, dailyUsage) => {
          Object.entries(dailyUsage).forEach(([key, value]) => {
            acc[key] = (acc[key] || 0) + value;
          });

          return acc;
        }, {} as Record<string, number>),
      [allWeekActivity]
    );

    const averageWeeklyActivity = React.useMemo(() => {
      const averageWeekly =
        getTotalWeeklyActivity(filteredWebsiteWeekActivity, sundayDate) / 7;
      return averageWeekly;
    }, [filteredWebsiteWeekActivity, sundayDate]);

    const presentedPickedDomain = pickedDomain ?? 'All Websites';

    return (
      <div>
        <WeeklyWebsiteActivityChart
          store={filteredWebsiteWeekActivity}
          sundayDate={sundayDate}
          presentChartTitle={() => `Activity On ${presentedPickedDomain}`}
        />
        <Panel>
          <TimeUsage
            title="Average Daily Activity"
            time={averageWeeklyActivity}
          ></TimeUsage>
        </Panel>
        <ActivityTable
          activity={totalWebsiteWeeklyActivity}
          title={'Websites This Week'}
          onDomainRowClicked={handleDomainRowClick}
        />
      </div>
    );
  };
