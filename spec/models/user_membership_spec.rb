require 'rails_helper'

describe UserMembership do

  before :each do
    @company = FactoryGirl.create(:company,:name,:license_rand, :with_divisions)
    @user = FactoryGirl.create(:user, :user,:company_id => @company.id)
  end

  it "has a valid user_id and division_id" do
     record = FactoryGirl.create(:user_membership, :user_id => @user.id ,:division_id => @company.divisions[0].id)
     expect(record).to be_valid
  end

  it "has an invalid user_id (-1)" do
     record = FactoryGirl.build(:user_membership, :user_id => -1 ,:division_id => @company.divisions[0].id)
     expect(record.save).to eq(false)
  end

  it "has an invalid user_id (0)" do
     record = FactoryGirl.build(:user_membership, :user_id => 0 ,:division_id => @company.divisions[0].id)
     expect(record.save).to eq(false)
  end

  it "has an invalid user_id (nil)" do
     record = FactoryGirl.build(:user_membership, :user_id => nil ,:division_id => @company.divisions[0].id)
     expect(record.save).to eq(false)
  end

  it "has an invalid user_id (does not exist)" do
     counter = 1;
     while (User.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:user_membership, :user_id => counter ,:division_id => @company.divisions[0].id)
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id (-1)" do
     record = FactoryGirl.build(:user_membership, :user_id => @user.id ,:division_id => -1)
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id (0)" do
     record = FactoryGirl.build(:user_membership, :user_id => @user.id ,:division_id => 0)
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id (nil)" do
     record = FactoryGirl.build(:user_membership, :user_id => @user.id ,:division_id => nil)
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id (does not exist)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:user_membership, :user_id => @user.id ,:division_id => counter)
     puts record.inspect
     puts "Counter #{counter}"
     puts "Division Exists? #{User.exists?(counter)}"
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id that does not belong to the user" do
     @company2 = FactoryGirl.create(:company,:name,:license_rand, :with_divisions)
     div2_id = @company2.divisions[0].id
     record = FactoryGirl.build(:user_membership, :user_id => @user.id ,:division_id => div2_id)
     expect(record.save).to eq(false)
  end

end
