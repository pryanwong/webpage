class CreateDrawingvers < ActiveRecord::Migration
  def change
    create_table :drawingvers do |t|
      t.text :drawingtext
      t.integer :drawing_id
      t.timestamp :ver_updated_at
      t.timestamp :ver_created_at

      t.timestamps
    end
  end
end
