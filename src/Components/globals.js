import moment from 'moment';

export const setDate = date => {
  return moment(date).format('Do MMM YYYY');
};

export const nullCheck = value => {
  if (
    [null, undefined, ''].includes(value) ||
    value.replace(/\s/g, '').length <= 0
  ) {
    return true;
  } else {
    return false;
  }
};
