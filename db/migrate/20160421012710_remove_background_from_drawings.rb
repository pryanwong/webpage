class RemoveBackgroundFromDrawings < ActiveRecord::Migration
  def self.up
    remove_attachment :drawings, :background
  end
end
