class UserMembership < ActiveRecord::Base
    belongs_to :user
    belongs_to :division
    scope :membershipExists, -> (division_id, user_id){ where("division_id = ? and user_id = ?", division_id, user_id) if (user_id.present? && division_id.present?)}
end
