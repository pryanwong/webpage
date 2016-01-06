class ChangeConstraintForEmail < ActiveRecord::Migration
  def self.up
    remove_index :users, :email
  end
end
