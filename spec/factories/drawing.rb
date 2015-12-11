# spec/factories/user.rb
require 'faker'

FactoryGirl.define do

  factory :drawing do |f|
    f.drawing ''
    f.privacy ''
    f.opportunity ''
    f.customer ''
    f.description ''
    f.division_id ''
    f.user_id ''
    f.company_id ''

  end

  trait :privacy_user do
     privacy :user
  end

  trait :privacy_division do
     privacy :division
  end

  trait :privacy_company do
     privacy :company
  end

end
