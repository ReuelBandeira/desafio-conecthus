import { NotificationErrorsProps } from './notification';

export default class NotificationErrors extends Error {
  constructor(public errors: NotificationErrorsProps[]) {
    super(errors.map((e) => `${e.context}: ${e.message}`).join(', '));
  }
}
