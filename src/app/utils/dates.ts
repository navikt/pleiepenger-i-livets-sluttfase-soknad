import dayjs from 'dayjs';

export const yesterday = dayjs().endOf('day').subtract(1, 'day').toDate();
