class AddProductIdColumnToPrices < ActiveRecord::Migration
  def change
    add_column :prices, :product_id, :integer
  end

  def down
     remove_column :prices, :product_id
  end
end
