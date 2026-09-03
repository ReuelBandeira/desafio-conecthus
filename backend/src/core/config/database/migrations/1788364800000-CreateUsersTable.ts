import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1788364800000 implements MigrationInterface {
  name = 'CreateUsersTable1788364800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`registration\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL,
        \`password\` VARCHAR(256) NOT NULL,
        \`isActive\` BOOLEAN NOT NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME NULL,
        \`deletedAt\` DATETIME NULL,
        UNIQUE INDEX \`IDX_users_registration\` (\`registration\`),
        UNIQUE INDEX \`IDX_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\`;`);
  }
}
