class AddPasswordToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :password, :string
    remove_column :users, :encrypted_password
  end

  def self.down
    add_column :users, :encrypted_password, :string
    remove_column :users, :password
  end
end
