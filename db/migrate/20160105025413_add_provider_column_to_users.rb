class AddProviderColumnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :provider, :string, :default => "google_oauth2"
  end

  def down
     remove_column :users, :provider
  end
end
