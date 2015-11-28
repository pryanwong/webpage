class RemoveIsadminFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :isadmin
  end
end
