require 'rails_helper'

describe UsersController, :type => :controller do

    let(:company1) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 1)}
    let(:company2) { FactoryGirl.build(:company,:name,:license_rand, :with_divisions, :id => 2)}
    let(:drawing) { FactoryGirl.build(:drawing, :privacy_company, :png=>"png", :drawing=>"", :user_id=> 1, :company_id=>1, :id=> 1)}
    let(:drawings) { FactoryGirl.build_list(:drawing, 5, :privacy_company, :png=>"png", :drawing=>"", :user_id=> 1, :company_id=>1, :id=> 1)}
    let(:company4) { double("company4", update_attributes: {name: "batman", licenses: "3"}, errors: {}, save: true, :id => 1)}
    let(:user) { FactoryGirl.build(:user, :admin, :company_id => 1 )}
    let(:user2) { double("user2", :role => 2, :admin? => true, :email => 'sf@optecture.ca', :id => 1, :company_id => 1)}
    let(:user3) { double("user2", :role => 2, :admin? => true, :email => 'sf@optecture.ca', :id => 2, :company_id => 1)}
    let(:users) { FactoryGirl.build_list(:user, 5,:admin, :company_id => 1 )}
    let(:divisions) { FactoryGirl.build_list(:division, 5)}
    let(:user_mem) { double("userMem", :errors => [], :destroy! => true, :length => 0)}
    before { allow_any_instance_of(CanCan::ControllerResource).to receive(:load_and_authorize_resource){ nil } }
    before { allow_any_instance_of(SpecTestHelper).to receive(:current_user){ user2 } }
    #let(:user_admin) { FactoryGirl.create(:user, :admin,:company_id => company2.id) }

    describe "GET 'showall'" do

      it "renders the showall page" do
         allow(User).to receive(:where).and_return([users])
         allow(User).to receive(:find).and_return(user)
         allow(User).to receive_message_chain(:all, :order, :paginate => users)
         get :showall, :company_id => 1, :user_id => 1, :id => 1
         expect(response).to render_template("layouts/application")
         expect(response).to render_template("users/showall")
         expect(assigns(:users).size).to eq(5)
      end


    end

    describe "GET 'switchuser'" do

      it "renders the company_user page and switches user" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)

        session[:switched] = false

        login(user3.email)
        get :switchuser, :company_id => 1, :user_id => 1
        expect(response).to redirect_to company_user_path(1,2)
        expect(session[:switched]).to eq(true)
      end

      it "renders the root_path page User did not exist" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(false)
        session[:switched] = false
        login(user3.email)
        get :switchuser, :company_id => 1, :user_id => 1
        expect(response).to redirect_to root_path
      end

      it "renders the root_path page because user already switched" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)
        login(user3.email)
        session.delete(:switched)
        session[:company_id] = 1
        session[:user_id] = 1
        session[:switched] = true
        get :switchuser, 'company_id' => 1, 'user_id' => 1
        expect(response).to redirect_to company_user_path(1,1)
      end

      it "renders the company_user page but doesn't switch users" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)
        session[:switched] = false
        login(user3.email)
        get :switchuser, :company_id => 1, :user_id => 1
        expect(response).to redirect_to company_user_path(1,2)
        expect(session[:switched]).to eq(true)
      end

    end

    describe "GET 'switchback'" do

      it "renders the company_user page and switches user back" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)

        session[:switched] = true

        login(user3.email)
        get :switchback, :company_id => 1, :user_id => 1
        expect(response).to redirect_to company_user_path(1,2)
        expect(assigns(:current_user)).to eq(user3)
      end

      it "renders the root_path page because user does not exist" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(false)
        session.delete(:switched)
        session[:switched] = false

        login(user3.email)
        get :switchback, :company_id => 1, :user_id => 1
        expect(response).to redirect_to root_path
      end
    end

    describe "POST 'new'" do

      it "renders 'new'" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)

        session[:switched] = true
        login(user3.email)
        post :new, :company_id => 1, :user_id => 1
        expect(response).to render_template("users/new")
        expect(assigns(:company)).to eq(company1)
      end

      it "renders the root_path page because company does not exist" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user3])
        allow(User).to receive(:find).and_return(user3)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)

        session[:switched] = true
        login(user3.email)
        post :new, :company_id => 1, :user_id => 1
        expect(response).to redirect_to(root_path)
      end
    end

    describe "GET 'show'" do

      it "renders 'show', listdrawings is true" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        login(user2.email)
        get :show, :company_id => 1, :id => 1
        expect(response).to render_template("users/show")
        expect(assigns(:userdrawings)).to eq(drawings)
        expect(assigns(:listdrawings)).to eq(true)
      end

      it "renders 'show', drawings empty, listdrawings is false" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => [])
        login(user2.email)
        get :show, :company_id => 1, :id => 1
        expect(response).to render_template("users/show")
        expect(assigns(:userdrawings)).to eq([])
        expect(assigns(:listdrawings)).to eq(false)
      end

      it "renders 'root_path', User doesn't exist" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => [])
        login(user2.email)
        get :show, :company_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "renders 'show', moderator_access" do
        allow(user2).to receive_messages(:id => 1, :admin? => false, :moderator? => true, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:moderator_access, :order, :paginate => drawings)
        login(user2.email)
        get :show, :company_id => 1, :id => 1
        expect(response).to render_template("users/show")
        expect(assigns(:userdrawings)).to eq(drawings)
        expect(assigns(:listdrawings)).to eq(true)
      end

      it "renders 'show', user_access" do
        allow(user2).to receive_messages(:id => 1, :admin? => false, :moderator? => false, :user? => true, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:user_access, :order, :paginate => drawings)
        login(user2.email)
        get :show, :company_id => 1, :id => 1
        expect(response).to render_template("users/show")
        expect(assigns(:userdrawings)).to eq(drawings)
        expect(assigns(:listdrawings)).to eq(true)
      end
    end

    describe "GET 'edit'" do

      it "renders 'edit'" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        login(user2.email)
        get :edit, :company_id => 1, :id => 1
        expect(response).to render_template("users/edit")
      end

      it "redirect_to root_path, User not found" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        login(user2.email)
        get :edit, :company_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "redirect_to root_path, Company not found" do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        login(user2.email)
        get :edit, :company_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end
    end

    describe "GET 'removeuserdiv'" do

      it "renders 'company_path' " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Division).to receive(:find).and_return(divisions[0])
        allow(Division).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        allow(UserMembership).to receive(:membershipExists).and_return([user_mem])
        allow(user2).to receive_message_chain(:drawings, :where, :update_all)
        allow(user_mem).to receive_messages(:errors => [], :destroy! => true)
        login(user2.email)
        get :removeuserdiv, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(company_path(1))
      end

      it "renders 'root_path', User not Found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Division).to receive(:find).and_return(divisions[0])
        allow(Division).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        allow(UserMembership).to receive(:membershipExists).and_return([user_mem])
        allow(user2).to receive_message_chain(:drawings, :where, :update_all)
        allow(user_mem).to receive_messages(:errors => [], :destroy! => true)
        login(user2.email)
        get :removeuserdiv, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "renders 'root_path', Company not Found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        allow(Division).to receive(:find).and_return(divisions[0])
        allow(Division).to receive(:exists?).and_return(true)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        allow(UserMembership).to receive(:membershipExists).and_return([user_mem])
        allow(user2).to receive_message_chain(:drawings, :where, :update_all)
        allow(user_mem).to receive_messages(:errors => [], :destroy! => true)
        login(user2.email)
        get :removeuserdiv, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "renders 'root_path', Division not Found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        allow(Division).to receive(:find).and_return(divisions[0])
        allow(Division).to receive(:exists?).and_return(false)
        allow(Drawing).to receive_message_chain(:includes, :all, :order, :paginate => drawings)
        allow(UserMembership).to receive(:membershipExists).and_return([user_mem])
        allow(user2).to receive_message_chain(:drawings, :where, :update_all)
        allow(user_mem).to receive_messages(:errors => [], :destroy! => true)
        login(user2.email)
        get :removeuserdiv, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end
    end

    describe "GET 'newdrawing'" do

      it "renders 'newdrawing' " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        get :newdrawing, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to render_template("users/newdrawing")
        expect(assigns(:divcount)).to eq(5)
      end

      it "redirect to 'root_path', Company Not Found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        login(user2.email)
        get :newdrawing, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

      it "redirect to 'root_path', User Not Found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        get :newdrawing, :company_id => 1, :division_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end
    end

    describe "GET 'newdrawingproc'" do

      it "renders 'newdrawingproc' " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :newdrawingproc, :company_id => 1, :id => 1, :drawing => {:opportunity => "op", :privacy => "company", :customer => "cust", :description => "desc", :company_id => 1, :division => 1}
        expect(response).to redirect_to(company_user_drawing_path(1,1, {:id => 1, :customer => "cust", :opportunity => "op", :description => "desc", :privacy => "company" , :division_id => 1}))
      end

      it "redirects to root_path, User not found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(false)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :newdrawingproc, :company_id => 1, :id => 1, :drawing => {:opportunity => "op", :privacy => "company", :customer => "cust", :description => "desc", :company_id => 1, :division => 1}
        expect(response).to redirect_to(root_path)
      end

      it "redirects to root_path, Company not found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        login(user2.email)
        post :newdrawingproc, :company_id => 1, :id => 1, :drawing => {:opportunity => "op", :privacy => "company", :customer => "cust", :description => "desc", :company_id => 1, :division => 1}
        expect(response).to redirect_to(root_path)
      end

      it "redirects to root_path, Privacy not found " do
        allow(user2).to receive_messages(:id => 1, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :newdrawingproc, :company_id => 1, :id => 1, :drawing => {:opportunity => "op", :privacy => "blahblah", :customer => "cust", :description => "desc", :company_id => 1, :division => 1}
        expect(response).to redirect_to(root_path)
      end
    end

    describe "POST 'update'" do

      it "redirects to company_path " do
        allow(user2).to receive_messages(:id => 1, :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :update, :company_id => 1, :id => 1, :user => { :role => "moderator", :email => "sf@sf.com"}
        expect(response).to redirect_to(company_path(1))
      end

      it "redirects to root_path, company_id not given " do
        allow(user2).to receive_messages(:id => 1, :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        login(user2.email)
        post :update, :id => 1, :company_id => 1, :user => { :role => "moderator", :email => "sf@sf.com"}
        expect(response).to redirect_to(root_path)
      end
    end

    describe "POST 'create'" do

      it "redirects to company_path " do
        allow(user2).to receive_messages(:id => 1, :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :create, :company_id => 1, :id => 1, :user => { :role => "moderator", :email => "sf@sf.com"}
        expect(response).to redirect_to(company_path(1))
      end

      it "redirects to root_path " do
        allow(user2).to receive_messages(:id => 1, :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        login(user2.email)
        post :create, :company_id => 1, :id => 1, :user => { :role => "moderator", :email => "sf@sf.com"}
        expect(response).to redirect_to(root_path)
      end

    end

    describe "GET 'destroy'" do

      it "redirects to company_path " do
        allow(user2).to receive_messages(:id => 1, :destroy => true, :destroyed? => true,  :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :destroyed? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(true)
        login(user2.email)
        post :destroy, :company_id => 1, :id => 1
        expect(response).to redirect_to(company_path(1))
      end

      it "redirects to root_path " do
        allow(user2).to receive_messages(:id => 1, :destroy => true, :destroyed? => true, :save => true, :user! => true, :moderator! => true, :email= => true, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1, :divisions => divisions)
        allow(user3).to receive_messages(:id => 2, :admin? => true, :moderator? => false, :user? => false, :email => "sf@test.com", :company_id => 1)
        allow(User).to receive(:where).and_return([user2])
        allow(User).to receive(:find).and_return(user2)
        allow(User).to receive(:exists?).and_return(true)
        allow(Company).to receive(:find).and_return(company1)
        allow(Company).to receive(:exists?).and_return(false)
        login(user2.email)
        post :destroy, :company_id => 1, :id => 1
        expect(response).to redirect_to(root_path)
      end

    end
end
