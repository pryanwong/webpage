# spec/factories/user.rb
require 'faker'

FactoryGirl.define do

  factory :user_membership do |f|
    f.user_id  1
    f.division_id 1
  end



end
