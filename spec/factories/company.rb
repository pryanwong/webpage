# spec/factories/company.rb
require 'faker'

FactoryGirl.define do

  factory :company do

    trait :name do
      name {Faker::Company.name}
    end

    trait :namefixed do
      name "SeanCo"
    end

    trait :noname do
      name ""
    end

    trait :license_rand do
      licenses {Faker::Number.number(2)}
    end

    trait :license_fixed do
      licenses 2
    end

    trait :nolicense do
       licenses ""
    end

    trait :licensechar do
       licenses "hello"
    end

    trait :licensedec do
       licenses 2.5
    end

    trait :licenseneg do
       licenses -1
    end

    trait :with_divisions do
      after :create do |company|
        FactoryGirl.create_list :division, 3, :company_id => company.id
      end
    end


  end

end
