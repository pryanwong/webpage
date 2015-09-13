class Division < ActiveRecord::Migration
  def change
    create_table :divisions do |t|
      t.string :name
      t.boolean :share
      t.integer :company_id
    end
  end
end
