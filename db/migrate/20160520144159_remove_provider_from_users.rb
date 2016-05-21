class RemoveProviderFromUsers < ActiveRecord::Migration
  def self.up
    remove_column :users, :provider
    add_column :users, :provider, :string
  end

  def self.down
    remove_column :users, :provider
    add_column :users, :provider, :integer
  end
end
