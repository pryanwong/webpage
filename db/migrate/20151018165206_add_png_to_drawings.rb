class AddPngToDrawings < ActiveRecord::Migration
  def change
    add_column :drawings, :png, :binary
  end
end
