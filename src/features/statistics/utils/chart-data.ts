import { IStudySession } from 'entities/sessions';
import { theme } from 'shared/theme';

export const getDailyData = (sessions: IStudySession[]) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData: Array<{ label: string; value: number; color: string }> = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const daySessions = sessions.filter(
      session =>
        session.startTime >= dayStart.getTime() &&
        session.startTime <= dayEnd.getTime(),
    );

    const dayTotalTime = daySessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    weekData.push({
      label: weekDays[date.getDay()],
      value: Math.round(dayTotalTime / (1000 * 60)),
      color: theme.semanticColors.brand,
    });
  }

  return weekData;
};

export const getWeeklyData = (sessions: IStudySession[]) => {
  const weekData: Array<{ label: string; value: number; color: string }> = [];
  const weekLabels = [
    'Week 1',
    'Week 2',
    'Week 3',
    'Week 4',
    'Week 5',
    'Week 6',
  ];

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now - i * weekMs);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = sessions.filter(
      session =>
        session.startTime >= weekStart.getTime() &&
        session.startTime <= weekEnd.getTime(),
    );

    const weekTotalTime = weekSessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    weekData.push({
      label: weekLabels[3 - i] || `Week ${4 - i}`,
      value: Math.round(weekTotalTime / (1000 * 60)),
      color: theme.semanticColors.success,
    });
  }

  return weekData;
};

export const getMonthlyData = (sessions: IStudySession[]) => {
  const monthData: Array<{ label: string; value: number; color: string }> = [];

  const now = Date.now();
  const monthMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now - i * monthMs);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthStart.getMonth() + 1);
    monthEnd.setDate(0);
    monthEnd.setHours(23, 59, 59, 999);

    const monthSessions = sessions.filter(
      session =>
        session.startTime >= monthStart.getTime() &&
        session.startTime <= monthEnd.getTime(),
    );

    const monthTotalTime = monthSessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    monthData.push({
      label: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      value: Math.round(monthTotalTime / (1000 * 60)),
      color: theme.semanticColors.warning,
    });
  }

  return monthData;
};
