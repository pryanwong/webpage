# spec/factories/division.rb
require 'faker'

FactoryGirl.define do

  sequence(:name) { |n| "DivName#{n}" }
  factory :division do |f|
    f.name
  end

  trait :noname do
    name ''
  end

  trait :nocompany do
    company_id nil
  end

  trait :negcompany do
    company_id -1
  end

  trait :zerocompany do
    company_id 0
  end
end
