import { alertConstants } from '../constants/alertConstants';

const success = message => ({ type: alertConstants.SUCCESS, message });
const error = message => ({ type: alertConstants.ERROR, message });
const clear = message => ({ type: alertConstants.CLEAR });

export const alertActions = {
  success,
  error,
  clear
}