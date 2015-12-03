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
  it "is invalid without licenses" do
     expect{FactoryGirl.create(:company,:name,:nolicense)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid with character license" do
     expect{FactoryGirl.create(:company,:name,:licensechar)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid with decimal license" do
     expect{FactoryGirl.create(:company,:name,:licensedec)}.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "is invalid with negative license" do
     expect{FactoryGirl.create(:company,:name,:licenseneg)}.to raise_error(ActiveRecord::RecordInvalid)
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
