import { Notification } from '@/core/domain/notification/notification';
import NotificationErrors from '@/core/domain/notification/notification.error';
import { UserValidatorFactory } from '@/modules/user/domain/factories/user.validator.factory';
import { randomUUID } from 'crypto';

export type UserProps = {
  id?: string;
  name: string;
  registration: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export type UserToJSON = {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class UserEntity {
  private _id: string;
  private _name: string;
  private _registration: string;
  private _email: string;
  private _password: string;
  private _isActive: boolean;
  private _updatedAt: Date | null;
  private _deletedAt: Date | null;
  readonly createdAt: Date;
  protected notifications: Notification = new Notification();

  constructor(props: UserProps) {
    this._id = props.id ?? randomUUID();
    this._name = props.name;
    this._registration = props.registration;
    this._email = props.email;
    this._password = props.password;
    this._isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? null;
    this._deletedAt = props.deletedAt ?? null;

    this.validate();
  }

  // The single choke point for validation: every setter calls this too, so
  // an entity can never be left holding data an earlier validate() call
  // rejected. Errors are collected fresh each time — a stale failure from a
  // previous call must not block a later, now-valid state.
  validate(): void {
    this.notifications = new Notification();
    UserValidatorFactory.create().validate(this);

    if (this.notifications.hasErrors()) {
      throw new NotificationErrors(this.notifications.getErrors());
    }
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get registration() {
    return this._registration;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get isActive() {
    return this._isActive;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get deletedAt() {
    return this._deletedAt;
  }
  get notification() {
    return this.notifications;
  }

  set id(value: string) {
    this._id = value.trim();
    this.validate();
  }
  set name(value: string) {
    this._name = value.trim();
    this.validate();
  }
  set username(value: string) {
    this._registration = value.trim();
    this.validate();
  }
  set email(value: string) {
    this._email = value.trim();
    this.validate();
  }
  set password(value: string) {
    this._password = value.trim();
    this.validate();
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }

  toJSON(): UserToJSON {
    return {
      id: this.id,
      name: this.name,
      registration: this.registration,
      email: this.email,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
