# spec/models/company.rb
require 'rails_helper'

describe Division do

  before(:each) { @company = FactoryGirl.create(:company,:name,:license_rand) }

  it "has a valid name" do
     record = FactoryGirl.create(:division, :company_id => @company.id)
     expect(record).to be_valid
  end
  it "is invalid without a name" do
     expect{FactoryGirl.create(:division,:noname, :company_id => @company.id)}.to raise_error(ActiveRecord::RecordInvalid)
  end
  it "is invalid without a company" do
     expect{FactoryGirl.create(:division,:nocompany)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid with a negative company" do
     expect{FactoryGirl.create(:division,:negcompany)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid with a zero company" do
     expect{FactoryGirl.create(:division,:zerocompany)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid to create two divisions with the same name for the same company" do
     record = FactoryGirl.create(:division, :name=>"bob", :company_id => @company.id)
     expect{FactoryGirl.create(:division, :name=>"bob", :company_id => @company.id)}.to raise_error(ActiveRecord::RecordInvalid)
  end




end
