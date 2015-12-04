require 'rails_helper'

describe CompaniesController do

    let(:company) { FactoryGirl.create(:company,:name,:license_rand, :with_divisions)}
    let(:user_moderator) {FactoryGirl.create(:user, :moderator,:company_id => company.id)}
    let(:user_user) {FactoryGirl.create(:user, :user,:company_id => company.id)}

    describe "GET 'index'" do
       it "renders the accessdenied page because no user was logged in" do
         get :index
         expect(response).to redirect_to("/accessdenied")
       end
     end

     describe "GET 'index'" do
       it "renders the index page because user was logged in as moderator" do
          puts "User Email Is: #{user_moderator.email}"
          login(user_moderator.email)
          get :index
          expect(response).to render_template("layouts/application")
          expect(response).to render_template("index")
       end
     end

     describe "GET 'index'" do
       it "renders the accessdenied page because user was logged in as user" do
          puts "User Email Is: #{user_user.email}"
          login(user_user.email)
          get :index
          expect(response).to redirect_to("/accessdenied")
       end
     end
end
