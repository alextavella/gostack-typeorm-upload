import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCategoryFieldToTransactions1593039529989
  implements MigrationInterface {
  private readonly foreignKey = 'TransactionCategory';

  private readonly tableName = 'transactions';

  private readonly fieldName = 'category_id';

  private readonly tableTarget = 'categories';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: this.fieldName,
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.foreignKey,
        columnNames: [this.fieldName],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableTarget,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKey);

    await queryRunner.dropColumn(this.tableName, this.fieldName);
  }
}
