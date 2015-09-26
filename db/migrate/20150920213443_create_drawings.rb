class CreateDrawings < ActiveRecord::Migration
  def change
    create_table :drawings do |t|
      t.text :drawing
      t.string  :customer
      t.string  :description
      t.integer :user_id
      t.string  :opportunity
      t.integer :opportunity_id
      t.integer :version
      t.text :notes
      t.timestamps
    end
  end

  def down
     drop_table :drawings
  end
end
