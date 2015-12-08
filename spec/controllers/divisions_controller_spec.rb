require 'rails_helper'

describe DivisionsController, :type => :controller do
  let(:user) {double("user", :company_id => 1, :id => 1) }

  describe "GET 'new'" do
    let(:company) { double("company", update_attributes: {name: "batman", licenses: "3"}, errors: {}, save: true, :id => 1)}
    let(:division) {double("division") }
    before :each do
    end

    it "renders the new page because user was logged in as admin" do
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:new).and_return(company)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company)
      allow(company).to receive_messages(:divisions => division)
      allow(division).to receive_messages(:build => division)
      login(user.email)
      get 'new', { :company_id => 1 }
      expect(response).to render_template("layouts/application")
      expect(response).to render_template("divisions/new")
    end

    it  "renders the new page because user was logged in as moderator" do
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:new).and_return(company)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company)
      allow(company).to receive_messages(:divisions => division)
      allow(division).to receive_messages(:build => division)
      login(user.email)
      get 'new', { :company_id => 1 }
      expect(response).to render_template("layouts/application")
      expect(response).to render_template("divisions/new")
    end

    it  "renders the accessdenied page because user was logged in as user" do
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:new).and_return(company)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company)
      allow(company).to receive_messages(:divisions => division)
      allow(division).to receive_messages(:build => division)
      login(user.email)
      get 'new', { :company_id => 1 }
      expect(response).to redirect_to("/accessdenied")
    end

    it  "renders the accessdenied page because user was not logged in" do
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:new).and_return(company)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company)
      allow(company).to receive_messages(:divisions => division)
      allow(division).to receive_messages(:build => division)
      get 'new', { :company_id => 1 }
      expect(response).to redirect_to("/accessdenied")
    end



  end


  describe "GET 'edit'" do
    let(:company2) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 2)}
    let(:company1) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 1)}
    let(:company) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 1)}
    let(:division) { FactoryGirl.build(:division, :name => "TestDiv", :company_id =>1)}
    let(:division2) { FactoryGirl.build(:division, :name => "TestDiv", :company_id =>2)}
    let(:user1) { FactoryGirl.build(:user,:moderator,:id=>1,:company_id=>1)}
    #let(:division) {double("division", :id=>1, :company_id => 1) }
    before :each do
    end

    it "renders the edit page because user was logged in as admin" do
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(Division).to receive(:find).and_return(division)
      allow(Division).to receive(:where).and_return(division)
      allow(Division).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company)
      login(user.email)
      get 'edit', { :id => 1, :company_id => 1 }
      expect(assigns(:company)).to eq(company)
      expect(assigns(:division)).to eq(division)
      expect(response).to render_template("layouts/application")
      expect(response).to render_template("divisions/edit")
    end

    it  "renders the edit page because user was logged in as moderator" do
      allow(user1).to receive(:company).and_return(company1)
      allow(User).to receive(:where).and_return([user1])
      allow(User).to receive(:find).and_return(user1)
      allow(Company).to receive(:find).and_return(company1)
      allow(Company).to receive(:where).and_return([company1])
      allow(Company).to receive(:exists?).and_return(true)
      puts "Company: #{company1.inspect}"

      ability = Ability.new(user1)
      puts "Test Company:  #{ability.can? :read, company1}"
      puts "Test Division:  #{ability.can? :read, division}"
      puts "Company Find: #{Company.find(1).inspect}"
      allow(Division).to receive(:find).and_return(division)
      allow(Division).to receive(:where).and_return([division])
      allow(Division).to receive(:exists?).and_return(true)

      login(user1.email)
      puts "Session Id: #{session[:user_id]}"
      puts "User Company_id: #{User.find(1).company_id}"
      puts "Company ID: #{company1.id}"
      puts "Division: #{division.inspect}"
      puts "Division Company_id: #{division.company_id}"
      get 'edit', { :id => 1, :company_id => 1 }
      puts "Company returned: #{assigns(:company).inspect}"
      puts "Division returned: #{assigns(:division).inspect}"


      expect(response).to render_template("layouts/application")
      expect(response).to render_template("divisions/edit")
      expect(assigns(:company)).to eq(company1)
      expect(assigns(:division)).to eq(division)
    end

    it  "renders the accessdenied page because user was logged in as moderator, but company was different" do
      allow(user1).to receive(:company).and_return(company1)
      allow(User).to receive(:where).and_return([user1])
      allow(User).to receive(:find).and_return(user1)
      allow(Company).to receive(:find).and_return(company2)
      allow(Company).to receive(:where).and_return([company2])
      allow(Company).to receive(:exists?).and_return(true)
      puts "Company: #{company1.inspect}"

      ability = Ability.new(user1)
      puts "Test Company:  #{ability.can? :read, company1}"
      puts "Test Division:  #{ability.can? :read, division}"
      puts "Company Find: #{Company.find(1).inspect}"
      allow(Division).to receive(:find).and_return(division2)
      allow(Division).to receive(:where).and_return([division2])
      allow(Division).to receive(:exists?).and_return(true)

      login(user1.email)
      puts "Session Id: #{session[:user_id]}"
      puts "User Company_id: #{User.find(1).company_id}"
      puts "Company ID: #{company1.id}"
      puts "Division: #{division.inspect}"
      puts "Division Company_id: #{division.company_id}"
      get 'edit', { :id => 1, :company_id => 2 }
      puts "Company returned: #{assigns(:company).inspect}"
      puts "Division returned: #{assigns(:division).inspect}"


      expect(response).to redirect_to("/accessdenied")
    end

    it  "renders the accessdenied page because user was logged in as user" do
      division = company.divisions[0]
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(Division).to receive(:find).and_return(division)
      allow(Division).to receive(:where).and_return(division)
      allow(Division).to receive(:exists?).and_return(true)
      allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company)
      login(user.email)
      get 'edit', { :id => 1, :company_id => 1 }
      expect(response).to redirect_to("/accessdenied")
    end

    it  "renders the accessdenied page because user was not logged in" do
      division = company.divisions[0]
      allow(User).to receive(:where).and_return([user])
      allow(User).to receive(:find).and_return(user)
      allow(Company).to receive(:find).and_return(company)
      allow(Company).to receive(:where).and_return(company)
      allow(Company).to receive(:exists?).and_return(true)
      allow(Division).to receive(:find).and_return(division)
      allow(Division).to receive(:where).and_return(division)
      allow(Division).to receive(:exists?).and_return(true)
      get 'edit', { :id => 1, :company_id => 1 }
      expect(response).to redirect_to("/accessdenied")
    end



  end

end
