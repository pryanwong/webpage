require 'rails_helper'

describe PagesController do
    describe "GET 'home'" do
       it "renders the home template" do
         get :home
         expect(response).to render_template("layouts/longpages")
         expect(response).to render_template("home")
       end
  end

   describe "GET 'failed'" do
      it "renders the failed template" do
        get :failed
        expect(response).to render_template("layouts/longpages")
        expect(response).to render_template("failed")
      end
   end

   describe "GET 'accessdenied'" do
      it "renders the accessdenied template" do
        get :accessdenied
        expect(response).to render_template("layouts/longpages")
        expect(response).to render_template("accessdenied")
      end
   end

end
