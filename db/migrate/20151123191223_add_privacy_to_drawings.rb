class AddPrivacyToDrawings < ActiveRecord::Migration
  def change
    add_column :drawings, :privacy, :integer, :null => false, :default => 0
    add_column :drawings, :division_id, :integer, :null => false, :default => 0
    add_column :drawings, :company_id, :integer, :null => false, :default => 0
  end
end
