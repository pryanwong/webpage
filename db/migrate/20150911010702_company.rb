class Company < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.integer :licenses
    end
  end
end
