class AddDetailsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :role_id, :integer
    add_column :users, :company, :string
  end
end
