require 'rails_helper'

describe CompaniesController, :type => :controller do

    let(:company1) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions)}
    let(:company2) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions)}
    let(:user) {double("user") }
    #let(:user_admin) { FactoryGirl.create(:user, :admin,:company_id => company2.id) }

    describe "GET 'index'" do

      it "renders the index page because user was logged in as admin" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:all).and_return([company1, company2])
         allow(Company).to receive(:where).and_return([company1, company2])
         login(user.email)
         get :index
         expect(response).to render_template("layouts/application")
         expect(response).to render_template("index")
         expect(assigns(:companies)).to match_array([company1, company2])
      end

       it "renders the accessdenied page because no user was logged in" do
         get :index
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the index page because user was logged in as moderator" do
          allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
          allow(User).to receive(:where).and_return([user])
          allow(User).to receive(:find).and_return(user)
          login(user.email)
          get :index
          expect(response).to render_template("layouts/application")
          expect(response).to render_template("index")
          expect(assigns(:companies)).to match_array([company1])
       end

       it "renders the accessdenied page because user was logged in as user" do
          allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
          allow(User).to receive(:where).and_return([user])
          allow(User).to receive(:find).and_return(user)
          login(user.email)
          get :index
          expect(response).to redirect_to("/accessdenied")
       end
     end
end
