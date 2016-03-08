class AddProviderColumnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :provider, :integer
  end

  def down
     remove_column :users, :provider
  end
end
