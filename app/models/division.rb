class Division < ActiveRecord::Base
    validates :name, presence: true
    has_many :user_memberships
    has_many :users, :through => :user_memberships
end
