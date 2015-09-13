class MembershipTable < ActiveRecord::Migration
  def change
    create_table :usermembership do |t|
          t.belongs_to :user, index: true
          t.belongs_to :division, index: true
    end
  end
end
