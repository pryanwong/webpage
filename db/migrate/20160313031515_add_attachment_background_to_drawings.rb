class AddAttachmentBackgroundToDrawings < ActiveRecord::Migration
  def self.up
    change_table :drawings do |t|
      t.attachment :background
    end
  end

  def self.down
    remove_attachment :drawings, :background
  end
end
