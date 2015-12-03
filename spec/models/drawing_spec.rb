require 'rails_helper'

describe Drawing do

  before :each do
    @company1 = FactoryGirl.create(:company,:name,:license_rand, :with_divisions)
    @company2 = FactoryGirl.create(:company,:name,:license_rand, :with_divisions)
    @user = FactoryGirl.create(:user, :user,:company_id => @company1.id)
  end

  it "is valid" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => @company1.divisions[0].id, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(true)
  end

  it "is invalid because privacy is division but no division given (nil)" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => nil, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(false)
  end

  it "is invalid because privacy is division but no division given (-1)" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => -1, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(false)
  end

  it "is invalid because privacy is division but no division given (doesn't exit)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => counter, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(false)
  end

  it "is valid because privacy is company but no division given (blank)" do
     record = FactoryGirl.build(:drawing, :privacy_company, :division_id => '', :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(true)
  end

  it "is valid because privacy is company but no division given (nil)" do
     record = FactoryGirl.build(:drawing, :privacy_company, :division_id => nil, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(true)
  end

  it "is valid because privacy is company but no division given (-1)" do
     record = FactoryGirl.build(:drawing, :privacy_company, :division_id => -1, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(true)
  end

  it "is valid because privacy is company but no division given (doesn't exit)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:drawing, :privacy_company, :division_id => counter, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(true)
  end

  it "is not valid because division does not belong to users company" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => @company2.divisions[0].id, :user_id => @user.id,:company_id => @company1.id)
     expect(record.save).to eq(false)
  end

  it "is not valid because company does not belong to users company" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => @company1.divisions[0].id, :user_id => @user.id,:company_id => @company2.id)
     expect(record.save).to eq(false)
  end

end
