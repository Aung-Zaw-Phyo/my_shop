import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialSchema1717571385530 implements MigrationInterface {

    async up(queryRunner) {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [{
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                ],
            }),
        );
        
        await queryRunner.createTable(
            new Table({
                name: 'admin',
                columns: [{
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                ],
            }),
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
    }

}
