class AddPortalToCompanies < ActiveRecord::Migration
  def change
    add_column :companies, :portal, :string
  end
end
