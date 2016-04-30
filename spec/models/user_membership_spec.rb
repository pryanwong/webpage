require 'rails_helper'

describe UserMembership do

  let(:company) { FactoryGirl.create(:company,:name,:license_rand, :portal, :with_divisions)}
  let(:user) {FactoryGirl.create(:user, :user,:provider, :company_id => company.id)}


  it "has a valid user_id and division_id" do
     record = FactoryGirl.create(:user_membership, :user_id => user.id ,:division_id => company.divisions[0].id)
     expect(record).to be_valid
  end

  [-1, 0, nil].each do |invalid_user_id|
     it "has an invalid user_id (#{invalid_user_id})" do
        record = FactoryGirl.build(:user_membership, :user_id => invalid_user_id ,:division_id => company.divisions[0].id)
        expect(record.save).to eq(false)
     end
  end

  it "has an invalid user_id (does not exist)" do
     counter = 1;
     while (User.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:user_membership, :user_id => counter ,:division_id => company.divisions[0].id)
     expect(record.save).to eq(false)
  end
  [-1, 0, nil].each do |invalid_division_id|
     it "has an invalid division_id (#{invalid_division_id})" do
        record = FactoryGirl.build(:user_membership, :user_id => user.id ,:division_id => invalid_division_id)
        expect(record.save).to eq(false)
     end
  end

  it "has an invalid division_id (does not exist)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:user_membership, :user_id => user.id ,:division_id => counter)
     expect(record.save).to eq(false)
  end

  it "has an invalid division_id that does not belong to the user" do
     @company2 = FactoryGirl.create(:company,:name,:license_rand,:portal, :with_divisions)
     div2_id = @company2.divisions[0].id
     record = FactoryGirl.build(:user_membership, :user_id => user.id ,:division_id => div2_id)
     expect(record.save).to eq(false)
  end

end
