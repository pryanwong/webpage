class UserMembership < ActiveRecord::Base
    belongs_to :user
    belongs_to :division
    validates :user_id, presence: true, numericality: { only_integer: true, :greater_than => 0  }
    validates :division_id, presence: true, numericality: { only_integer: true, :greater_than => 0  }
    validates_presence_of :user, :division
    validates_uniqueness_of :division_id, :scope => :user_id
    validate :inclusion_of_division_for_user_company
    scope :membershipExists, -> (division_id, user_id){ where("division_id = ? and user_id = ?", division_id, user_id) if (user_id.present? && division_id.present?)}

    def inclusion_of_division_for_user_company
       if User.exists?(self.user_id)
          company_id = User.find(self.user_id).company_id
          div_included = Division.where(:company_id => company_id).pluck(:id).include?(self.division_id)
          if !div_included
             errors.add(:division_id, t('activerecord.user_membership.no_company'))
          end
       else
         errors.add(:company_id, no_company)
       end
    end
end
