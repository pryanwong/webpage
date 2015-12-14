# spec/models/company.rb
require 'rails_helper'

describe Company do
  it "has a valid name" do
     record = FactoryGirl.create(:company,:name,:license_rand)
     expect(record).to be_valid
  end
  it "is invalid without a name" do
     expect{FactoryGirl.create(:company,:noname,:license_rand)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  ['', -1, 1.1, 'blahblah', nil].each do |invalid_license_num|
     it "is invalid with an invalid license number (#{invalid_license_num})" do
        expect{FactoryGirl.create(:company,:name,:licenses => invalid_license_num)}.to raise_error(ActiveRecord::RecordInvalid)
     end   
  end

  it "cannot be destroyed with divisions" do
    record = FactoryGirl.create(:company,:name,:license_rand,:with_divisions)
    expect{record.destroy!}.to raise_error(ActiveRecord::RecordNotDestroyed)
  end

  it "cannot have a duplicate" do
    record = FactoryGirl.create(:company, :namefixed, :license_rand,:with_divisions)
    expect{FactoryGirl.create(:company, :namefixed, :license_rand,:with_divisions)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "can be destroyed once divisions removed" do
    record = FactoryGirl.create(:company,:name,:license_rand,:with_divisions)
    divisions = record.divisions
    divisions.each do |div|
      div.destroy
    end
    record.reload
    record.destroy
    expect(User.exists?(record)).to eq(false)
  end

end
