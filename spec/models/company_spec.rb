# spec/models/company.rb
require 'rails_helper'

describe Company do
  it "has a valid name" do
     record = FactoryGirl.create(:company,:name,:license)
     expect(record).to be_valid
  end
  it "is invalid without a name" do
     expect{FactoryGirl.create(:company,:noname,:license)}.to raise_error(ActiveRecord::RecordInvalid)
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

end
