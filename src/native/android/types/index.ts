export type UsageStatsType = {
  packageName: string;
  totalTimeInForeground: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
  lastTimeUsed: number;
}

export type UsageStatsEventType = {
  packageName: string;
  eventType: number;
  timeStamp: number;
  className?: string;
}
