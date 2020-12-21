import dayjs from 'dayjs';

export const ago = (createdAt: Date | undefined): string => {
  if(!createdAt) return ''
  
  let ago = '';
  const agoMinutes = dayjs().diff(createdAt, 'minute');
  ago = `${agoMinutes} minute${agoMinutes > 0 ? 's' : ''} ago`;
  if (agoMinutes > 60) {
    const agoHours = dayjs().diff(createdAt, 'hour');
    ago = `${agoHours} hour${agoHours > 1 ? 's' : ''} ago`;
  }
  if (agoMinutes > 1440) {
    const agoDays = dayjs().diff(createdAt, 'day');
    ago = `${agoDays} day${agoDays > 1 ? 's' : ''} ago`;
  }
  if (agoMinutes > 10080) {
    const agoWeeks = dayjs().diff(createdAt, 'week');
    ago = `${agoWeeks} week${agoWeeks > 1 ? 's' : ''} ago`;
  }
  if (agoMinutes > 44640) {
    const agoMonths = dayjs().diff(createdAt, 'month');
    ago = `${agoMonths} month${agoMonths > 1 ? 's' : ''} ago`;
  }
  if (agoMinutes > 525600) {
    const agoYears = dayjs().diff(createdAt, 'year');
    ago = `${agoYears} year${agoYears > 1 ? 's' : ''} ago`;
  }
  return ago;
};
