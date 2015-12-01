# spec/factories/company_factory.rb
require 'faker'

FactoryGirl.define do
  
  sequence(:name) { |n| "DivName#{n}" }
  factory :division do |f|
    f.name
    f.company_id 1
  end

end
