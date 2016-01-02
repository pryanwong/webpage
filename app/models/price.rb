class Price < ActiveRecord::Base

  belongs_to :company
  validates_presence_of :company
  validates :name, presence: true
  validates :id, presence: true, numericality: { only_integer: true, :greater_than => 0  }
  validates :company_id, presence: true, numericality: { only_integer: true, :greater_than => 0  }
  validates_uniqueness_of :name, :scope => :company_id
  validates_uniqueness_of :id

end
