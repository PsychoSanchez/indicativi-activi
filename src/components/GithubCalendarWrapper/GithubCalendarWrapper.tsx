import classNames from 'classnames/bind';
import * as React from 'react';
import Calendar from 'react-github-contribution-calendar';
import ReactTooltip from 'react-tooltip';
import { debounce } from 'throttle-debounce';

import { getIsoDate } from '../../shared/dates-helper';

import { GithubCalendarProps } from './types';

import styles from './styles.css';

const cx = classNames.bind(styles);

const INACTIVE_DAY_COLOR = '#262944';
const LOW_ACTIVITY_DAY_COLOR = '#5f607e';
const MEDIUM_ACTIVITY_DAY_COLOR = '#9d9dbc';
const HIGH_ACTIVITY_DAY_COLOR = '#dfdfff';
const COLORS = [
  INACTIVE_DAY_COLOR,
  LOW_ACTIVITY_DAY_COLOR,
  MEDIUM_ACTIVITY_DAY_COLOR,
  HIGH_ACTIVITY_DAY_COLOR,
];

const BUTTON_DATE_ATTRIBUTE = 'data-date';
const REACT_TOOLTIP_ID = 'activity-calendar';
const REACT_TOOLTIP_SHOW_DELAY_MS = 100;

const getDefaultTooltip = (date: string) => date;

const debouncedSetCalendarTooltips = debounce(
  200,
  (
    calendarContainer: HTMLDivElement,
    getTooltip: Required<GithubCalendarProps>['getTooltip']
  ) => {
    const elements = calendarContainer.querySelectorAll('rect');

    const elementDate = new Date();
    Array.from(elements)
      .reverse()
      .forEach((el, index) => {
        elementDate.setDate(elementDate.getDate() - Math.min(1, index));

        const elementIsoDate = getIsoDate(elementDate);

        el.setAttribute(BUTTON_DATE_ATTRIBUTE, elementIsoDate);
        el.setAttribute('data-tip', getTooltip(elementIsoDate));
        el.setAttribute('data-for', REACT_TOOLTIP_ID);
      });

    ReactTooltip.rebuild();
  }
);

export const GithubCalendarWrapper: React.FC<GithubCalendarProps> = ({
  activity,
  onDateClick,
  getTooltip = getDefaultTooltip,
}) => {
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!calendarRef.current) {
      return;
    }

    debouncedSetCalendarTooltips(calendarRef.current, getTooltip);
  }, [getTooltip]);

  const handleDateClick = React.useCallback(
    (el) => {
      const target = el.target as HTMLElement;
      if (target.nodeName !== 'rect') {
        return;
      }

      onDateClick(
        target.getAttribute(BUTTON_DATE_ATTRIBUTE) || getIsoDate(new Date())
      );
    },
    [onDateClick]
  );

  return (
    <div className={cx('calendar')} ref={calendarRef} onClick={handleDateClick}>
      {/* @ts-ignore */}
      <Calendar values={activity} panelColors={COLORS} />
      <ReactTooltip
        id={REACT_TOOLTIP_ID}
        delayShow={REACT_TOOLTIP_SHOW_DELAY_MS}
      />
    </div>
  );
};
