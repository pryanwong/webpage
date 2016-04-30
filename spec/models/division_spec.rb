# spec/models/company.rb
require 'rails_helper'

describe Division do

  let(:company) { FactoryGirl.create(:company,:name,:license_rand,:portal)}
  let(:company2) { FactoryGirl.create(:company,:name,:license_rand,:portal)}

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

  it "is valid to create two divisions with the same name for two seperate companies" do
     record = FactoryGirl.create(:division, :name=>"bob", :company_id => company.id)
     record2 = FactoryGirl.create(:division, :name=>"bob", :company_id => company2.id)
     expect(record2).to be_valid
  end



end
