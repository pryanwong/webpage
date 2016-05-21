# spec/factories/user.rb
require 'faker'

FactoryGirl.define do

  factory :user do |f|
    f.email {Faker::Internet.email}
    f.company_id 1
  end

  trait :moderator do
    role  User.roles["moderator"]
  end

  trait :user do
    role  User.roles["user"]
  end

  trait :guest do
    role  User.roles["guest"]
  end

  trait :admin do
    role  User.roles["admin"]
  end

  trait :provider do
    provider "google_oauth2"
  end

end
