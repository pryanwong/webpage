class UsersController < ApplicationController
  #before_filter(:only => [:index, :show]) { unauthorized! if cannot? :read, :user }
  helper_method :sort_column, :sort_column_user, :sort_direction
  load_and_authorize_resource :user
  #load_and_authorize_resource :drawing
  before_filter :check_for_cancel, :only => [:newdrawingproc, :create, :update]

  def showall
    @users = User.all.order("email" + " " + sort_direction).paginate(page: params[:page], per_page: 10)
  end

  def switchuser
    if current_user.admin? && !session[:switched] == true
       session[:switched]  = true;
       session[:adminuser] = session[:user_id]
       session[:admincompany] = session[:company_id]
       @user = User.find(params[:user_id])
       @current_user = @user
       session.delete(:user_id)
       session.delete(:company_id)
       session[:user_id]  = @user.id
       session[:company_id] = @user.company_id
       redirect_to company_user_path(@user.company_id , @user.id)
    else
       redirect_to company_user_path(session[:company_id] , session[:user_id])
    end
  end

  def switchback
    if session[:switched]
       session.delete(:switched)
       @user = User.find(session[:adminuser])
       @current_user = @user
       session.delete(:adminuser)
       session.delete(:admincompany)
       session.delete(:user_id)
       session.delete(:company_id)
       session[:user_id]  = @user.id
       session[:company_id] = @user.company_id
    end
    redirect_to company_user_path(session[:company_id] , session[:user_id])
  end

  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    @company = Company.find(params[:company_id])
    @user = User.new
    @user.company = @company
  end

  def show
    @user = User.find(params[:id]);
    @listdrawings = false;
    @privacies = Drawing.privacies
    @divs = @user.divisions.to_a
    if @user.admin?
         @userdrawings = Drawing.includes(:user).all.order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.moderator?
         @userdrawings = Drawing.moderator_access(@user).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.user?
         @userdrawings = Drawing.user_access(@user).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    end
    if (@userdrawings.count > 0 )
       @listdawings = true;
    end
  end

  def drawsearch
     @searchparam = params[:search]
     @user = User.find(params[:id])
     divs = @user.divisions
     div_ids = divs.select{|u| u.share==true}.map{|x| x[:id]}
     if (div_ids.count > 0)
        user_ids = UserMembership.where(division: div_ids).map{|y| y[:user_id]}.uniq
        @userdrawings = Drawing.where(user_id: user_ids).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
     else
     #   @listdawings = true;
        @userdrawings = Drawing.where(user_id: session[:user_id]).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
     end
     if (@userdrawings.count > 0 )
        @listdawings = true;
     end
     render 'show'
  end

  def edit
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    @company = Company.find(params[:company_id])
    @user = User.find(params[:id])
  end

  def removeuserdiv
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:division_id])
    @user = User.find(params[:id])
    @user.drawings.where(:division_id => params[:division_id].to_i).update_all(:privacy => Drawing.privacies["company"])
    @division.users.delete(@user)
    redirect_to company_path(@company)
  end

  def newdrawing
       @user = User.find(params[:id])
       @company = Company.find(@user.company_id)
       @drawing = Drawing.new
       @drawing.user_id = @user.id
       @drawing.company_id = @user.company_id
       @divisions = @user.divisions
       @divs = (@divisions).to_a
       @divcount = @divs.length
       params.merge(:user_id => @user.id)
  end

  def newdrawingproc
       @user = User.find(params[:id])
       @company = Company.find(@user.company_id)
       @drawing = Drawing.new
       @drawing.customer = params[:drawing][:customer]
       @drawing.opportunity = params[:drawing][:opportunity]
       @drawing.description = params[:drawing][:description]
       @drawing.company_id  = params[:drawing][:company_id]
       priv_level = params[:drawing][:privacy]
       @drawing.privacy     = Drawing.privacies[priv_level]
       if @drawing.privacy == "division"
          @drawing.division_id = params[:drawing][:division]
       else
          @drawing.division_id = 0
       end
       params.merge(:id => @user.id)
       logger.fatal "Drawing Object #{@drawing.inspect}"
       redirect_to company_user_drawing_path(@company.id, @user.id, {:id => @user.id, :customer => @drawing.customer, :opportunity => @drawing.opportunity, :description => @drawing.description, :privacy => @drawing.privacy, :division_id => @drawing.division_id})
  end

  def update

    @company = Company.new
    @user = User.find(params[:id])
    #Verify that Company id is valid
    company_valid, company_errors = @company.companyValid(params[:company_id])
    if (!company_valid)
      addErrorsToFlash(company_errors)
      redirect_to user_path(session[:user_id])
      return
    end

    user_params_valid, user_errors = @user.validateExistingUser(params)
    if (!user_params_valid)
       addErrorsToFlash(user_errors)
       redirect_to edit_company_user_path(params[:company_id], params[:id])
       return
    end

    successful_update, errors = @user.updateUser(params)
    addErrorsToFlash(errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def create
    @company = Company.new
    #Verify that Company id is valid
    company_valid, company_errors = @company.companyValid(params[:company_id])
    if (!company_valid)
      addErrorsToFlash(company_errors)
      redirect_to user_path(session[:user_id])
      return
    end
    @company = Company.find(params[:company_id])
    @user = User.new
    sufficientLicenses = {};
    successfullyAdded = {};
    user_params_valid, errors = @user.validateNewUser(params)

    #Validate User Parameters
    if (!user_params_valid)
       addErrorsToFlash(errors)
       redirect_to new_company_user_path(params[:company_id])
       return
    end

    #Verify There are Sufficient Licenses to Add User
    sufficientLicenses, licenseError = @company.additionalUserLicensed
    if (sufficientLicenses)
      #Add User To Company
      successfullyAdded, addUserErrors = @user.addNewUser(params)
      addErrorsToFlash(addUserErrors)
    else
      addErrorsToFlash(licenseError)
    end

    #Redirect to Company Listing
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def destroy
    @user = User.find(params[:id])
    val, errors = @user.deleteUser
    addErrorsToFlash(errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  private

    def user_params
      params.require(:user).permit(:email, :isadmin, :role)
    end

    def sort_column
       (Drawing.column_names.include?(params[:sort]) || (params[:sort] == "users.email")) ? params[:sort] : "updated_at"
    end

    def sort_direction
       %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end

    def check_for_cancel
      session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
      if params[:button] == "Cancel"
        redirect_to session.delete(:return_to)
      end
    end

    def addErrorsToFlash(errors)
      errors.each do |key, val|
        flash[key] = val;
      end
    end

end
