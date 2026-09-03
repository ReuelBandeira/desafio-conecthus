import NotificationErrors from '@/core/domain/notification/notification.error';
import { UserEntity, UserProps } from './user.entity';

const validProps: UserProps = {
  name: 'Joao Silva',
  registration: '12345678',
  // Deliberately shaped like a bcrypt hash: long, with symbols, way more
  // than 6 chars — regression check for the entity no longer enforcing the
  // plaintext password format against the stored hash.
  password: '$2b$10$K7x9QwErTyUiOpAsDfGhJkLzXcVbNm1234567890abcdefghi',
  email: 'joao@email.com',
  isActive: true,
};

describe('UserEntity', () => {
  it('creates a valid entity', () => {
    const user = new UserEntity(validProps);

    expect(user.name).toBe(validProps.name);
    expect(user.registration).toBe(validProps.registration);
    expect(user.email).toBe(validProps.email);
    expect(user.isActive).toBe(true);
  });

  it('generates an id when one is not provided', () => {
    const user = new UserEntity(validProps);

    expect(user.id).toEqual(expect.any(String));
    expect(user.id.length).toBeGreaterThan(0);
  });

  it('defaults isActive to true when not provided', () => {
    const user = new UserEntity({
      name: validProps.name,
      registration: validProps.registration,
      email: validProps.email,
      password: validProps.password,
    } as UserProps);

    expect(user.isActive).toBe(true);
  });

  it('does not re-validate the plaintext password format against a hashed value', () => {
    // The bcrypt-shaped password in validProps is 50+ chars with symbols —
    // it would fail a 6-alphanumeric-chars rule if the domain still applied
    // plaintext rules to the stored hash. It must not throw.
    expect(() => new UserEntity(validProps)).not.toThrow();
  });

  it('rejects a name containing digits', () => {
    expect(() => new UserEntity({ ...validProps, name: 'Jo4o' })).toThrow(
      NotificationErrors,
    );
  });

  it('rejects a registration containing letters', () => {
    expect(
      () => new UserEntity({ ...validProps, registration: 'abc123' }),
    ).toThrow(NotificationErrors);
  });

  it('rejects an invalid email', () => {
    expect(
      () => new UserEntity({ ...validProps, email: 'not-an-email' }),
    ).toThrow(NotificationErrors);
  });

  it('rejects an empty password', () => {
    expect(() => new UserEntity({ ...validProps, password: '' })).toThrow(
      NotificationErrors,
    );
  });

  it('re-validates on setters and rejects an invalid update', () => {
    const user = new UserEntity(validProps);

    expect(() => {
      user.name = 'Jo4o';
    }).toThrow(NotificationErrors);
  });

  it('does not expose the password in toJSON', () => {
    const user = new UserEntity(validProps);

    expect(user.toJSON()).not.toHaveProperty('password');
  });
});
