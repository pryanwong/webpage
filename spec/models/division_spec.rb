# spec/models/company.rb
require 'rails_helper'

describe Division do

  let(:company) { FactoryGirl.create(:company,:name,:license_rand)}

  it "has a valid name" do
     record = FactoryGirl.create(:division, :company_id => company.id)
     expect(record).to be_valid
  end
  it "is invalid without a name" do
     expect{FactoryGirl.create(:division,:noname, :company_id => company.id)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  ['', -1, 0, nil].each do |invalid_company_id|
     it "is invalid without a valid company_id (#{invalid_company_id})" do
        expect{FactoryGirl.create(:division,:company_id => invalid_company_id)}.to raise_error(ActiveRecord::RecordInvalid)
     end
  end

  it "is invalid to create two divisions with the same name for the same company" do
     record = FactoryGirl.create(:division, :name=>"bob", :company_id => company.id)
     expect{FactoryGirl.create(:division, :name=>"bob", :company_id => company.id)}.to raise_error(ActiveRecord::RecordInvalid)
  end




end
