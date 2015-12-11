require 'rails_helper'

describe DrawingsController, :type => :controller do

    let(:company1) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 1)}
    let(:company2) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 2)}
    let(:drawing) { FactoryGirl.build(:drawing, :privacy_company, :drawing=>"", :user_id=> 1, :company_id=>1, :id=> 1)}
    let(:company4) { double("company4", update_attributes: {name: "batman", licenses: "3"}, errors: {}, save: true, :id => 1)}
    let(:user) {double("user") }
    let(:divisions) { FactoryGirl.build_list(:division, 5)}
    before { allow_any_instance_of(CanCan::ControllerResource).to receive(:load_and_authorize_resource){ nil } }
    #let(:user_admin) { FactoryGirl.create(:user, :admin,:company_id => company2.id) }

    describe "GET 'edit'" do

      it "renders the index page because user was logged in as admin" do
         allow(user).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(drawing).to receive_messages(:drawing=>"")
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Drawing).to receive(:exists?).and_return(true)
         allow(Drawing).to receive(:find).and_return(drawing)
         login(user.email)
         get :edit, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to render_template("layouts/editlayout")
         expect(response).to render_template("drawings/edit")
         expect(assigns(:editdetails)).to eq(true)
      end

      it "renders the index page because user was logged in as moderator" do
         drawing2 = double("drawing", :company_id => 1, :drawing=>"test", :id => 1, :user_id => 1, :pluck =>1 )
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Drawing).to receive(:exists?).and_return(true)
         allow(drawing2).to receive_messages(:drawing=>"test")
         allow(Drawing).to receive(:find).and_return(drawing2)
         allow(Drawing).to receive(:pluck).and_return([1])
         login(user.email)
         get :edit, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to render_template("layouts/editlayout")
         expect(response).to render_template("drawings/edit")
         expect(assigns(:editdetails)).to eq(true)
      end

      it "renders the index page because user was logged in as moderator, with drawing blank" do
         drawing2 = double("drawing", :company_id => 1, :drawing=>"", :drawing= => "", :id => 1, :user_id => 1, :pluck =>1 )
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Drawing).to receive(:exists?).and_return(true)
         allow(drawing2).to receive_messages(:drawing=>"")
         allow(drawing2).to receive_messages(:drawing= =>"")
         allow(Drawing).to receive(:find).and_return(drawing2)
         allow(Drawing).to receive(:pluck).and_return([1])
         login(user.email)
         get :edit, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to render_template("layouts/editlayout")
         expect(response).to render_template("drawings/edit")
         expect(assigns(:editdetails)).to eq(true)
      end

      it "renders the root page because user was logged in as moderator, with drawing non-existant" do
         drawing2 = double("drawing", :company_id => 1, :drawing=>"", :drawing= => "", :id => 1, :user_id => 1, :pluck =>1 )
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Drawing).to receive(:exists?).and_return(false)
         allow(drawing2).to receive_messages(:drawing=>"")
         allow(drawing2).to receive_messages(:drawing= =>"")
         allow(Drawing).to receive(:find).and_return(drawing2)
         allow(Drawing).to receive(:pluck).and_return([1])
         login(user.email)
         get :edit, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to redirect_to root_path
      end

      it "renders the index page because user was logged in as user" do
         allow(user).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
         allow(User).to receive(:where).and_return([user])
         allow(User).to receive(:find).and_return(user)
         allow(Drawing).to receive(:exists?).and_return(true)
         allow(Drawing).to receive(:find).and_return(drawing)
         login(user.email)
         get :edit, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to render_template("layouts/editlayout")
         expect(response).to render_template("drawings/edit")
         expect(assigns(:editdetails)).to eq(true)
      end


    end

    describe "GET 'editdrawingdetails'" do
      it "renders the editdrawingdetails page" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        get :editdrawingdetails, :company_id => 1, :user_id => 1, :id => 1
        expect(response).to render_template("drawings/editdrawingdetails")
        expect(assigns(:divcount)).to eq(5)
      end

      it "fails to render the editdrawingdetails page, User exists false" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        get :editdrawingdetails, :company_id => 1, :user_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "fails to render the editdrawingdetails page, Company does not exist" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        get :editdrawingdetails, :company_id => 1, :user_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "fails to render the editdrawingdetails page, Drawing does not exist" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(false)
        get :editdrawingdetails, :company_id => 1, :user_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end
    end

    describe "GET 'updatedrawingdetails'" do
      it "renders the updatedrawingdetails page" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        allow(drawing).to receive(:update_attributes).and_return(true)
        login(user.email)
        get :updatedrawingdetails, :company_id => 1, :user_id => 1, :id => 1, :drawing => {:privacy => 2, :opportunity =>"hi", :customer => "peter", :description => "description", :division => "1"}
        expect(response).to redirect_to(edit_company_user_drawing_path(1, 1, 1))
      end

      it "renders root_path page, cannot find user" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        allow(drawing).to receive(:update_attributes).and_return(true)
        login(user.email)
        get :updatedrawingdetails, :company_id => 1, :user_id => 1, :id => 1, :drawing => {:privacy => 2, :opportunity =>"hi", :customer => "peter", :description => "description", :division => "1"}
        expect(response).to redirect_to(root_path)
      end

      it "renders the root_path page, cannot find company" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        allow(drawing).to receive(:update_attributes).and_return(true)
        login(user.email)
        get :updatedrawingdetails, :company_id => 1, :user_id => 1, :id => 1, :drawing => {:privacy => 2, :opportunity =>"hi", :customer => "peter", :description => "description", :division => "1"}
        expect(response).to redirect_to(root_path)
      end

      it "renders the root_path page, cannot find drawing" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:where).and_return([company1])
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(false)
        allow(drawing).to receive(:update_attributes).and_return(true)
        login(user.email)
        get :updatedrawingdetails, :company_id => 1, :user_id => 1, :id => 1, :drawing => {:privacy => 2, :opportunity =>"hi", :customer => "peter", :description => "description", :division => "1"}
        expect(response).to redirect_to(root_path)
      end
    end

    describe "POST 'create'" do
      it "redirects to the edit_company_user_drawing_path page" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:new).and_return(drawing)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        allow(drawing).to receive(:save).and_return(true)
        login(user.email)
        post :create, :company_id => 1, :user_id => 1, :id => 1, :privacy => "company", :opportunity =>"hi", :customer => "peter", :description => "description", :division_id => "1"
        expect(response).to redirect_to edit_company_user_drawing_path(1, 1, 1)
      end

      it "redirects to the edit_company_user_path page, because drawing could not be saved" do
        allow(user).to receive_messages(:id => 1, :admin? => false, :divisions => divisions, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :company => company1)
        allow(User).to receive(:where).and_return([user])
        allow(User).to receive(:find).and_return(user)
        allow(User).to receive(:exists?).and_return(true)
        allow(Drawing).to receive(:new).and_return(drawing)
        allow(Drawing).to receive(:where).and_return([drawing])
        allow(Drawing).to receive(:find).and_return(drawing)
        allow(Drawing).to receive(:exists?).and_return(true)
        allow(drawing).to receive(:save).and_return(false)
        login(user.email)
        post :create, :company_id => 1, :user_id => 1, :id => 1, :privacy => "company", :opportunity =>"hi", :customer => "peter", :description => "description", :division_id => "1"
        expect(response).to redirect_to company_user_path(1, 1)
      end
    end
end
