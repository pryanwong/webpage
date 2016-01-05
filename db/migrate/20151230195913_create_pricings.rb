class CreatePricings < ActiveRecord::Migration
  def up
    create_table :prices do |t|
      t.integer :company_id
      t.integer :version
      t.string :name
      t.text :price

      t.timestamps
    end
  end

  def down
    drop_table :prices
  end
end
