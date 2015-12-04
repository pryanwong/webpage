require 'rails_helper'

describe Drawing do

  let(:company1) { FactoryGirl.create(:company,:name,:license_rand, :with_divisions)}
  let(:company2) { FactoryGirl.create(:company,:name,:license_rand, :with_divisions)}
  let(:user) { FactoryGirl.create(:user, :user,:company_id => company1.id)}


  it "is valid" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => company1.divisions[0].id, :user_id => user.id,:company_id => company1.id)
     expect(record.save).to eq(true)
  end

  [-1, 0, nil].each do |invalid_division_id|
     it "is invalid because privacy is division but no division given (#{invalid_division_id})" do
        record = FactoryGirl.build(:drawing, :privacy_division, :division_id => invalid_division_id, :user_id => user.id,:company_id => company1.id)
        expect(record.save).to eq(false)
     end
  end

  it "is invalid because privacy is division but no division given (doesn't exit)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => counter, :user_id => user.id,:company_id => company1.id)
     expect(record.save).to eq(false)
  end

  ['', -1, 0, nil].each do |invalid_division_id|
     it "is valid because privacy is company but no division given (#{invalid_division_id})" do
        record = FactoryGirl.build(:drawing, :privacy_company, :division_id => invalid_division_id, :user_id => user.id,:company_id => company1.id)
        expect(record.save).to eq(true)
     end
  end

  it "is valid because privacy is company but no division given (doesn't exit)" do
     counter = 1;
     while (Division.exists?(counter)) do
       counter+=1
     end
     record = FactoryGirl.build(:drawing, :privacy_company, :division_id => counter, :user_id => user.id,:company_id => company1.id)
     expect(record.save).to eq(true)
  end

  it "is not valid because division does not belong to users company" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => company2.divisions[0].id, :user_id => user.id,:company_id => company1.id)
     expect(record.save).to eq(false)
  end

  it "is not valid because company does not belong to users company" do
     record = FactoryGirl.build(:drawing, :privacy_division, :division_id => company1.divisions[0].id, :user_id => user.id,:company_id => company2.id)
     expect(record.save).to eq(false)
  end

end
