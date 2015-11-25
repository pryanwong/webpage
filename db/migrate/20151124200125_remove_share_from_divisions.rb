class RemoveShareFromDivisions < ActiveRecord::Migration
  def change
    remove_column :divisions, :share, :boolean
  end
end
