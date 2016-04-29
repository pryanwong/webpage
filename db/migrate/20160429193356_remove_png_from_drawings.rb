class RemovePngFromDrawings < ActiveRecord::Migration
  def change
    remove_column :drawings, :png, :binary
  end
end
