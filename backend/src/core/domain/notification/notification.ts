export type NotificationErrorsProps = {
  message: string;
  context: string;
};

export class Notification {
  private errors: NotificationErrorsProps[] = [];

  addError(error: NotificationErrorsProps): void {
    this.errors.push(error);
  }
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  getErrors(): NotificationErrorsProps[] {
    return this.errors;
  }
}
