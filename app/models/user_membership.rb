class UserMembership < ActiveRecord::Base
    belongs_to :user
    belongs_to :division
end