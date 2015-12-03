class Division < ActiveRecord::Base
    has_many :user_memberships, :dependent => :restrict_with_error
    has_many :users, :through => :user_memberships
    belongs_to :company
    validates_presence_of :company
    validates :name, presence: true
    validates :company_id, presence: true, numericality: { only_integer: true, :greater_than => 0  }
    validates_uniqueness_of :name, :scope => :company_id

end
