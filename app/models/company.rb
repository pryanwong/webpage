class Company < ActiveRecord::Base
    has_many :users
    has_many :divisions
    validates :name, presence: true
    validates :licenses, presence: true
end
