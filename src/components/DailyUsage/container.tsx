import * as React from 'react';
import classNames from 'classnames/bind';

import {
  subscribeToBackgroundBrowserSyncStoreUpdate,
  unsubscribeFromBackgroundBrowserSyncStoreUpdate,
} from '../../shared/background-browser-sync-storage';
import { getIsoDate } from '../../shared/dates-helper';
import { DailyUsage } from './component';

import styles from './styles.css';

const cx = classNames.bind(styles);

export interface DailyUsageContainerProps {}

export const DailyUsageContainer: React.FC<DailyUsageContainerProps> = ({}) => {
  const [date, setDate] = React.useState(getIsoDate(new Date()));
  const [dailyActivity, setDailyActivity] = React.useState<
    Record<string, number>
  >({});

  React.useEffect(() => {
    const storageListener = (activity: Record<string, any>) => {
      setDailyActivity(activity[date] || {});
    };

    subscribeToBackgroundBrowserSyncStoreUpdate(storageListener);

    return () => {
      unsubscribeFromBackgroundBrowserSyncStoreUpdate(storageListener);
    };
  }, [date]);

  const totalDailyActivity =
    Object.values(dailyActivity).reduce((acc, val) => acc + val, 0) || 0;

  return (
    <div className={cx('panel-body', 'daily-usage-body')}>
      <DailyUsage
        date={date}
        onDateChange={setDate}
        dailyActivity={dailyActivity}
        totalDailyActivity={totalDailyActivity}
      />
    </div>
  );
};