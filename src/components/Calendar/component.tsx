import * as React from 'react';
import Calendar from 'react-github-contribution-calendar';
import classNames from 'classnames/bind';

import { ActivityCalendarProps } from './types';

import styles from './component.css';

const cx = classNames.bind(styles);

const INACTIVE_DAY_COLOR = '#262944';
const LOW_ACTIVITY_DAY_COLOR = '#3d638c';
const MEDIUM_ACTIVITY_DAY_COLOR = '#4586cc';
const HIGH_ACTIVITY_DAY_COLOR = '#1b86f9';
const COLORS = [
  INACTIVE_DAY_COLOR,
  LOW_ACTIVITY_DAY_COLOR,
  MEDIUM_ACTIVITY_DAY_COLOR,
  HIGH_ACTIVITY_DAY_COLOR,
];

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activity,
}) => {
  return (
    <div className={cx('calendar')}>
      {/* @ts-ignore */}
      <Calendar values={activity} panelColors={COLORS} />
    </div>
  );
};