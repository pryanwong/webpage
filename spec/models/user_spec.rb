require 'rails_helper'

describe User do

  before(:each) { @company = FactoryGirl.create(:company,:name,:license_rand, :with_divisions) }

  it "has a valid email" do
     record = FactoryGirl.create(:user, :user,:company_id => @company.id)
     expect(record).to be_valid
  end

  it "has an invalid email" do
     record = FactoryGirl.build(:user, :user, email: "blahblahblah", :company_id => @company.id)
     expect(record.save).to eq(false)
  end

  it "has an invalid company (none)" do
     record = FactoryGirl.build(:user, :user, :nocompany)
     expect(record.save).to eq(false)
  end

  it "has an invalid company (zero)" do
     record = FactoryGirl.build(:user, :user, :zerocompany)
     expect(record.save).to eq(false)
  end

  it "has an invalid company (1000000)" do
     record = FactoryGirl.build(:user, :user, company_id: 1000000)
     expect(record.save).to eq(false)
  end

  it "has an invalid role" do
     expect{FactoryGirl.build(:user, :user, role: 20, :company_id => @company.id)}.to raise_error(ArgumentError)
  end

  it "has a unique email" do
    record = FactoryGirl.create(:user, :user, email: "sferenci1@yahoo.com", :company_id => @company.id)
    expect{FactoryGirl.create(:user, :user, email: "sferenci1@yahoo.com", :company_id => @company.id)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "cannot be deleted when a drawing is attached to it" do
    user = FactoryGirl.create(:user, :user, :company_id => @company.id)
    user_id = user.id
    draw = FactoryGirl.create(:drawing, :privacy_division, :division_id => @company.divisions[0].id, :user_id => user.id,:company_id => @company.id)
    puts "User: #{user.inspect}"
    puts "draw: #{draw.inspect}"
    user.destroy
    expect(User.exists?(user_id)).to eq(true)
  end

  it "deletes its user memberships when it is destroyed" do
    user = FactoryGirl.create(:user, :user, :company_id => @company.id)
    #puts user.inspect
    #puts @company.divisions[0].inspect
    div  = @company.divisions[0]
    usermembership = FactoryGirl.build(:user_membership, user_id: user.id, division_id: div.id)
    #puts usermembership.inspect
    #puts "Saving Usermembership #{usermembership.save}"
    usermembership.save
    user.destroy
    expect(UserMembership.exists?(usermembership)).to eq(false)
  end

  it "can be be created because there are enough licenses" do
    @company1 = FactoryGirl.create(:company,:name, :license_fixed, :with_divisions)
    user = FactoryGirl.create(:user, :user, :company_id => @company1.id)
    user2 = FactoryGirl.build(:user, :user, :company_id => @company1.id)
    expect(user2.save).to eq(true)
  end

  it "cannot be be created because of insufficient licenses" do
    @company1 = FactoryGirl.create(:company,:name,:license_fixed, :with_divisions)
    user = FactoryGirl.create(:user, :user, :company_id => @company1.id)
    user2 = FactoryGirl.create(:user, :user, :company_id => @company1.id)
    user3 = FactoryGirl.build(:user, :user, :company_id => @company1.id)
    expect(user3.save).to eq(false)
  end

end
