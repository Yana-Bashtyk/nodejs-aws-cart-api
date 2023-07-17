import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id');
    table.uuid('cart_id').references('id').inTable('carts');
    table.json('payment');
    table.json('delivery');
    table.text('comments');
    table.enum('status', ["OPEN", "APPROVED","CONFIRMED","SENT","COMPLETED","CANCELLED" ]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
