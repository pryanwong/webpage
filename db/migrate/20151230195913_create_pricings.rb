class CreatePricings < ActiveRecord::Migration
  def change
    create_table :prices do |t|
      t.integer :company_id
      t.integer :version
      t.string :name
      t.text :price

      t.timestamps
    end
  end
end
