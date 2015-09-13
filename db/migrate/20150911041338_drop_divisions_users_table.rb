class DropDivisionsUsersTable < ActiveRecord::Migration
  def change
    drop_table :divisions_users
  end
end
