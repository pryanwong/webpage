class DropUsermemberships < ActiveRecord::Migration
  def change
    drop_table :usermembership
    create_table :user_memberships do |t|
          t.belongs_to :user, index: true
          t.belongs_to :division, index: true
    end
  end
end
