require 'rails_helper'

describe CompaniesController, :type => :controller do

    let(:company1) { FactoryGirl.build(:company,:name,:license_rand, :portal, :with_divisions, :id => 1)}
    let(:company2) { FactoryGirl.build(:company,:name,:license_rand, :portal,:with_divisions, :id => 2)}
    let(:company3) { double("company3", update_attributes: {name: "batman", licenses: "3", portal: "TestPortal"}, errors: {})}
    let(:company4) { double("company4", update_attributes: {name: "batman", licenses: "3", portal: "TestPortal"}, errors: {}, save: true, :id => 1)}
    let(:user) {double("user") }
    #let(:user_admin) { FactoryGirl.create(:user, :admin,:company_id => company2.id) }

    describe "GET 'index'" do

      it "renders the index page because user was logged in as admin" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :provider=> 0, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(@current_user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :provider=> 0, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(User).to receive(:new).and_return(user)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         allow(Company).to receive(:all).and_return([company1, company2])
         allow(Company).to receive(:where).and_return([company1, company2])
         login(user.email)
         puts "Login as Admin: #{user.admin?}"
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
          allow(user).to receive(:id).and_return(1)
          allow(user).to receive(:role).and_return(3)
          allow(user).to receive(:admin?).and_return(false)
          allow(user).to receive(:moderator?).and_return(true)
          allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
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
          allow(user).to receive(:id).and_return(1)
          allow(user).to receive(:role).and_return(3)
          allow(user).to receive(:admin?).and_return(false)
          allow(user).to receive(:moderator?).and_return(false)
          allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
          login(user.email)
          get :index
          expect(response).to redirect_to("/accessdenied")
       end
     end

     describe "GET 'new'" do
       it "renders the accessdenied page because no user was logged in" do
         get :new
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (user role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :new
         expect(response).to redirect_to("/accessdenied")
         #expect(response).to render_template("layouts/application")
         #expect(response).to render_template("companies/new")
       end

       it "renders the accessdenied page because user (moderator role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :new
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the new page because user (admin role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:new).and_return(company1)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :new
         expect(response).to render_template("new")
         expect(assigns(:company)).to eq(company1)
       end
     end

     describe "GET 'show'" do
       it "renders the accessdenied page because no user was logged in" do
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         get :show, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (user role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the show page because user (moderator role) was logged in, and the company is his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 1
         expect(assigns(:company)).to eq(company1)
         expect(response).to render_template("show")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company2)
         allow(Company).to receive(:where).and_return(company2)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 2
         expect(assigns(:company)).to eq(company2)
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the show page because user (admin role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company2)
         allow(Company).to receive(:where).and_return(company2)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 2
         expect(assigns(:company)).to eq(company2)
         expect(response).to render_template("show")
       end

       it "renders the accessdenied page because user (user role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 999
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 999
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end

       it "redirects to the company list page because user (admin role) was logged in, and the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :show, :id => 2
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end
     end

     describe "GET 'edit'" do
       it "renders the accessdenied page because no user was logged in" do
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         get :edit, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (user role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied because user (moderator role) was logged in, and the company is his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 1
         expect(assigns(:company)).to eq(company1)
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company2)
         allow(Company).to receive(:where).and_return(company2)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 2
         expect(assigns(:company)).to eq(company2)
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the show page because user (admin role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company2)
         allow(Company).to receive(:where).and_return(company2)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 2
         expect(assigns(:company)).to eq(company2)
         expect(response).to render_template("edit")
       end

       it "renders the accessdenied page because user (user role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 999
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 999
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end

       it "renders accessdenied page because user (admin role) was logged in, and the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         get :edit, :id => 2
         expect(assigns(:company)).to eq(nil)
         expect(response).to redirect_to("/recordnotfound")
       end
     end


     describe "PUT 'update'" do
       it "renders the accessdenied page because no user was logged in" do
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         put :update, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (user role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(true)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 1
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied because user (moderator role) was logged in, and the company is his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company1)
         allow(Company).to receive(:where).and_return(company1)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 1, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company2)
         allow(Company).to receive(:where).and_return(company2)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 2, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the companies page because user (admin role) was logged in, and the company was not his" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:find).and_return(company3)
         allow(Company).to receive(:where).and_return(company3)
         allow(Company).to receive(:exists?).and_return(true)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 2, company: {name: "batman", licenses: "3"}
         expect(company3).to have_received(:update_attributes)
         expect(response).to redirect_to(companies_path)
       end

       it "renders the accessdenied page because user (user role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 999, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/recordnotfound")
       end

       it "renders the accessdenied page because user (moderator role) was logged in, but the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 999, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/recordnotfound")
       end

       it "redirects to the company list page because user (admin role) was logged in, and the company did not exist" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:exists?).and_return(false)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         put :update, :id => 2, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/recordnotfound")
       end
     end





     describe "POST 'create'" do
       it "renders the accessdenied page because no user was logged in" do
         allow(Company).to receive(:new).and_return(company4)
         allow(company4).to receive_messages(:save => true)
         post :create, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied page because user (user role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(company4).to receive_messages(:save => true)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:new).and_return(company4)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(1)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(true)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         post :create, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the accessdenied because user (moderator role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(company4).to receive_messages(:save => true)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:new).and_return(company4)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(2)
         allow(user).to receive(:admin?).and_return(false)
         allow(user).to receive(:moderator?).and_return(true)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         post :create, company: {name: "batman", licenses: "3"}
         expect(response).to redirect_to("/accessdenied")
       end

       it "renders the companies page because user (admin role) was logged in" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(company4).to receive_messages(:save => true)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Company).to receive(:new).and_return(company4)
         allow(user).to receive(:id).and_return(1)
         allow(user).to receive(:role).and_return(3)
         allow(user).to receive(:admin?).and_return(true)
         allow(user).to receive(:moderator?).and_return(false)
         allow(user).to receive(:user?).and_return(false)
         allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
         login(user.email)
         post :create, company: {name: "batman", licenses: "3"}
         expect(company4).to have_received(:save)
         expect(response).to redirect_to(companies_path)
       end
     end


       describe "DELETE 'destroy'" do
         it "renders the accessdenied page because no user was logged in" do
           allow(Company).to receive(:new).and_return(company4)
           allow(company4).to receive_messages(:delete => true)
           allow(Company).to receive(:exists?).and_return(true)
           delete :destroy, :id => 1
           expect(response).to redirect_to("/recordnotfound")
         end

         it "renders the accessdenied page because user (user role) was logged in" do
           allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
           allow(company4).to receive_messages(:save => true)
           allow(User).to receive(:where).and_return([user])
           allow(User).to receive(:find).and_return(user)
           allow(Company).to receive(:exists?).and_return(true)
           allow(user).to receive(:id).and_return(1)
           allow(user).to receive(:role).and_return(1)
           allow(user).to receive(:admin?).and_return(false)
           allow(user).to receive(:moderator?).and_return(false)
           allow(user).to receive(:user?).and_return(true)
           allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
           login(user.email)
           delete :destroy, :id => 1
           expect(response).to redirect_to("/recordnotfound")
         end

         it "renders the accessdenied because user (moderator role) was logged in" do
           allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
           allow(company4).to receive_messages(:destroy => true)
           allow(User).to receive(:where).and_return([user])
           allow(User).to receive(:find).and_return(user)
           allow(Company).to receive(:exists?).and_return(true)
           allow(user).to receive(:id).and_return(1)
           allow(user).to receive(:role).and_return(2)
           allow(user).to receive(:admin?).and_return(false)
           allow(user).to receive(:moderator?).and_return(true)
           allow(user).to receive(:user?).and_return(false)
           allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
           login(user.email)
           delete :destroy, :id => 1
           expect(response).to redirect_to("/recordnotfound")
         end

         it "renders the companies page because user (admin role) was logged in, no company exists" do
           allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
           allow(company4).to receive_messages(:destroy => true)
           allow(User).to receive(:where).and_return([user])
           allow(User).to receive(:find).and_return(user)
           allow(Company).to receive(:exists?).and_return(false)
           allow(Company).to receive(:find).and_return(nil)
           allow(user).to receive(:id).and_return(1)
           allow(user).to receive(:role).and_return(3)
           allow(user).to receive(:admin?).and_return(true)
           allow(user).to receive(:moderator?).and_return(false)
           allow(user).to receive(:user?).and_return(false)
           allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
           login(user.email)
           delete :destroy, :id => 1
           expect(company4).to have_received(:destroy).at_most(0).times
           expect(response).to redirect_to(companies_path)
         end

         it "renders the companies page because user (admin role) was logged in" do
           allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
           allow(company4).to receive_messages(:destroy => true)
           allow(User).to receive(:where).and_return([user])
           allow(User).to receive(:find).and_return(user)
           allow(Company).to receive(:exists?).and_return(true)
           allow(Company).to receive(:find).and_return(company4)
           allow(user).to receive(:id).and_return(1)
           allow(user).to receive(:role).and_return(3)
           allow(user).to receive(:admin?).and_return(true)
           allow(user).to receive(:moderator?).and_return(false)
           allow(user).to receive(:user?).and_return(false)
           allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
           login(user.email)
           delete :destroy, :id => 1
           expect(company4).to have_received(:destroy)
           expect(response).to redirect_to(companies_path)
         end

     end
end
