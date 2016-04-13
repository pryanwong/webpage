class UsersController < ApplicationController
  #before_filter(:only => [:index, :show]) { unauthorized! if cannot? :read, :user }
  helper_method :sort_column, :sort_column_user, :sort_direction, :sort_search
  load_and_authorize_resource :user
  #load_and_authorize_resource :drawing
  #before_filter :check_for_cancel, :only => [:newdrawingproc, :create, :update]

  def showall
    logger.info "In Users Controller:showall"
    @users = User.all.order("email" + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    logger.info "Leaving Users Controller:showall"
  end

  def switchuser
    logger.info "In Users Controller:switchuser"
    if (User.exists?(params[:user_id]))
       logger.info "User Exists id: #{params[:user_id]}"
       @user = User.find(params[:user_id]);
    else
       logger.error "User not Found id: #{params[:user_id]}"
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    if current_user.admin? && !session[:switched] == true
       logger.info "current_user.admin? && !session[:switched]"
       session[:switched]  = true;
       session[:adminuser] = session[:user_id]
       session[:admincompany] = session[:company_id]
       session[:adminrole] = session[:role]
       session[:adminemail] = session[:email]
       @current_user = @user
       session.delete(:user_id)
       session.delete(:company_id)
       session.delete(:role)
       session.delete(:email)
       session[:user_id]  = @user.id
       session[:company_id] = @user.company_id
       session[:role]  = @user.role
       session[:email] = @user.email
       redirect_to company_user_path(@user.company_id , @user.id)
       return
    else
       redirect_to company_user_path(session[:company_id] , session[:user_id])
    end
    logger.info "Leaving Users Controller:switchuser"
  end

  def switchback
    logger.info "Entering Users Controller:switchback"
    if (User.exists?(session[:adminuser]))
       logger.info "User Exists id: #{session[:adminuser]}"
       @user = User.find(session[:adminuser]);
    else
       logger.error "User not Found id: #{session[:adminuser]}"
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    if session[:switched]
       logger.info "Session Switched"
       session.delete(:switched)
       @current_user = @user
       session.delete(:adminuser)
       session.delete(:admincompany)
       session.delete(:adminrole)
       session.delete(:adminemail)
       session.delete(:user_id)
       session.delete(:company_id)
       session.delete(:role)
       session.delete(:email)
       session[:user_id]  = @user.id
       session[:company_id] = @user.company_id
       session[:role]  = @user.role
       session[:email] = @user.email
    end
    logger.info "Leaving Users Controller:switchback"
    redirect_to company_user_path(session[:company_id] , session[:user_id])
  end

  def new
    logger.info "Entering Users Controller:new"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (Company.exists?(params[:company_id]))
       logger.info "Company Exists #{params[:company_id]}"
       @company = Company.find(params[:company_id])
    else
      logger.error "Company not Found #{params[:company_id]}"
      flash[:error] = "Company not Found"
      redirect_to root_path
      return
    end
    @user = User.new
    @user.company = @company
    logger.info "Leaving Users Controller:new"
  end

  def show
    logger.info "In Users Controller:show"
    logger.debug "#{params.inspect}"
    if (User.exists?(params[:id]))
       logger.debug "User Exists id: #{params[:id]}"
       @user = User.find(params[:id]);
    else
       logger.error "User not found #{params[:id]}"
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    @showdrawing = true;
    @listdrawings = false;
    @privacies = Drawing.privacies
    @divs = @user.divisions.to_a
    searchterm = ""
    @placeholder_val = ""
    @placeholder     = ""
    logger.debug "Checking if search term is present"
    if (params.has_key?("srch_term"))
      logger.debug "Searching for: #{params["srch_term"]}"
      searchterm = params["srch_term"].downcase
      @searchVal = params["srch_term"]
    end
    if @user.admin?
         logger.debug "User is an admin"
         @userdrawings = Drawing.includes(:user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.moderator?
         logger.debug "User is an moderator"
         @userdrawings = Drawing.moderator_access(@user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.user?
         logger.debug "User is an user"
         @userdrawings = Drawing.user_access(@user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    end
    if (@userdrawings.count > 0 )
       logger.debug "More than one drawing is present"
       logger.debug "listdrawings is true"
       @listdrawings = true;
    end
    logger.info "Leaving Users Controller:show"
  end

  def edit
    logger.info "Entering Users Controller:edit"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (Company.exists?(params[:company_id]))
       logger.debug "Company Exists #{params[:company_id]}"
       @company = Company.find(params[:company_id]);
    else
       logger.debug "Company not Found #{params[:company_id]}"
       flash[:error] = "Company not Found"
       logger.info "Leaving Users Controller:edit"
       redirect_to root_path
       return
    end
    if (User.exists?(params[:id]))
       logger.debug "User Exists #{params[:id]}"
       @user = User.find(params[:id]);
    else
       logger.debug "User not Found #{params[:id]}"
       flash[:error] = "User not Found"
       logger.info "Leaving Users Controller:edit"
       redirect_to root_path
       return
    end
    logger.info "Leaving Users Controller:edit"
  end

  def removeuserdiv
    logger.info "Entering Users Controller:removeuserdiv"
    if (Company.exists?(params[:company_id]))
       logger.debug "Company Exists #{params[:company_id]}"
       @company = Company.find(params[:company_id]);
    else
       flash[:error] = "Company not Found"
       redirect_to root_path
       return
    end
    if (Division.exists?(params[:division_id]))
       logger.debug "Division Exists #{params[:division_id]}"
       @division = Division.find(params[:division_id])
    else
      logger.debug "Division not Found #{params[:division_id]}"
      flash[:error] = "Division not Found"
      redirect_to root_path
      return
    end
    if (User.exists?(params[:id]))
       logger.debug "User Exists #{params[:id]}"
       @user = User.find(params[:id]);
    else
       logger.debug "User not Found #{params[:id]}"
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    @user.drawings.where(:division_id => params[:division_id].to_i).update_all(:privacy => Drawing.privacies["company"])
    userMembership = UserMembership.membershipExists(@division.id, @user.id)
    userErrors = {}
    logger.debug "userMembership.length: #{userMembership.length}"
    if (userMembership.length == 1)
        successfullyDestroyed = userMembership[0].destroy!
        if successfullyDestroyed
          logger.debug "User Has Been Deleted From Division"
          userErrors[:notice] = "User Has Been Deleted From Division"
        else
          if (!userMembership.errors.empty?)
             userMembership.errors.each do |attr,err|
               userErrors[attr] = err.to_s()
             end
          end
          logger.error "Could Not Remove User From Division"
          userErrors[:could_not_update] = "Could Not Remove User From Division"
        end
     else
        logger.error "Could Not Find User In Division"
        userErrors[:errors] = "Could Not Find User In Division"
     end
    addErrorsToFlash(userErrors)
    logger.info "Leaving Users Controller:removeuserdiv"
    redirect_to company_path(@company)
  end

  def newdrawing
       logger.info "Entering Users Controller:newdrawing"
       if (User.exists?(params[:id]))
          logger.debug "User Exists #{params[:id]}"
          @user = User.find(params[:id]);
       else
          logger.debug "User not Found #{params[:id]}"
          flash[:error] = "User not Found"
          redirect_to root_path
          return
       end
       if (Company.exists?(params[:company_id]))
          logger.debug "Company Exists #{params[:company_id]}"
          @company = Company.find(params[:company_id]);
       else
          logger.debug "Company not Found #{params[:company_id]}"
          flash[:error] = "Company not Found"
          redirect_to root_path
          return
       end
       @drawing = Drawing.new
       @drawing.user_id = @user.id
       @drawing.company_id = @user.company_id
       @divisions = @user.divisions
       @divs = (@divisions).to_a
       @divcount = @divs.length
       params.merge(:user_id => @user.id)
       logger.info "Leaving Users Controller:newdrawing"
  end

  def newdrawingproc
       logger.info "Entering Users Controller:newdrawingproc"
       if (User.exists?(params[:id]))
          logger.debug "User Exists #{params[:id]}"
          @user = User.find(params[:id]);
       else
          logger.debug "User not Found #{params[:id]}"
          flash[:error] = "User not Found"
          logger.info "Leaving Users Controller:newdrawingproc"
          redirect_to root_path
          return
       end
       if (Company.exists?(@user.company_id))
          logger.debug "Company Exists #{params[:company_id]}"
          @company = Company.find(@user.company_id);
       else
          logger.debug "Company not Found #{params[:company_id]}"
          flash[:error] = "Company not Found"
          logger.info "Leaving Users Controller:newdrawingproc"
          redirect_to root_path
          return
       end
       @drawing = Drawing.new
       @drawing.customer = params[:drawing][:customer]
       @drawing.opportunity = params[:drawing][:opportunity]
       @drawing.description = params[:drawing][:description]
       @drawing.company_id  = params[:drawing][:company_id]
       priv_level = params[:drawing][:privacy]
       if (Drawing.privacies.keys.include?priv_level)
         @drawing.privacy     = Drawing.privacies[priv_level]
         logger.debug "Privacy Level #{@drawing.privacy}"
       else
         logger.debug "Privacy Level not Found"
         flash[:error] = "Privacy Level not Found"
         redirect_to root_path
         return
       end
       @drawing.division_id = params[:drawing][:division]
       params.merge(:id => @user.id)
       logger.debug "Drawing Object #{@drawing.inspect}"
       logger.info "Leaving Users Controller:newdrawingproc"
       redirect_to company_user_drawing_path(@company.id, @user.id, {:id => @user.id, :customer => @drawing.customer, :opportunity => @drawing.opportunity, :description => @drawing.description, :privacy => @drawing.privacy, :division_id => @drawing.division_id})
  end

  def update
    logger.info "Entering Users Controller:update"
    @user = User.new
    if (User.exists?(id: params[:id]))
       logger.debug "User Exists #{params[:id]}"
       @user = User.find(params[:id])
    else
       logger.debug "User Could Not Be Found #{params[:id]}"
       flash[:error] = "User Could Not Be Found"
       logger.info "Leaving Users Controller:update"
       redirect_to companies_path
       return
    end
    logger.debug "Params are: #{params.inspect}"
    if (!params[:user][:role].blank?)
       logger.debug "User role not blank"
       if params[:user][:role] == "moderator"
          @user.role = User.roles["moderator"]
          logger.debug "User role is moderator}"
       else
          @user.role = User.roles["user"]
          logger.debug "User role is user}"
       end
    end

    if (!params[:user][:provider].blank?)
       logger.debug "User provider is not blank"
       @user.provider = User.providers[params[:user][:provider]]
    else
       logger.debug "User provider is blank, set to 0"
       @user.provider = 0;
    end

    if (!params[:user][:email].blank?)
       logger.debug "User email is not blank"
       @user.email = params[:user][:email]
    end

    logger.debug "User is being saved"
    successfullyUpdated = @user.save
    if !successfullyUpdated
       logger.error "User update failed #{@user.errors}"
       addErrorsToFlash(@user.errors)
    else
       logger.info "User Has Been Updated"
       flash[:notice] = "User Has Been Updated"
    end
    if (Company.exists?(params[:company_id]))
       logger.info "Leaving Users Controller:update"
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    logger.info "Leaving Users Controller:update"
    redirect_to root_path
  end

  def create
    logger.info "Entering Users Controller:create"
    logger.debug "User CREATE Params: #{params.inspect}"
    provalue = User.providers[params[:user][:provider]]
    logger.debug "Provider Value: #{provalue}"
    @company = Company.new
    if (!Company.exists?(id: params[:company_id]))
       logger.debug "Company Could Not Be Found #{params[:company_id]}"
       flash[:error] = "Company Could Not Be Found"
       logger.info "Leaving Users Controller:create"
       redirect_to root_path
       return
    else
       logger.debug "Company Found #{params[:company_id]}"
       @company = Company.find(params[:company_id])
       role_val = User.roles[(params[:user][:role])]
       successfullyAdded = false;
       userErrors = {}
       @user = User.new(email: params[:user][:email], role: role_val, company_id: params[:company_id], provider: provalue)
       successfullyAdded = @user.save
       if !successfullyAdded
         addErrorsToFlash(@user.errors)
         logger.error "User Has Failed To Be Created"
         flash[:error] = "User Has Failed To Be Created"
       else
         logger.debug "User Has Been Created"
         flash[:notice] = "User Has Been Created"
       end
    end
    if (!params[:company_id].blank?)
       logger.info "Leaving Users Controller:create"
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    logger.info "Leaving Users Controller:create"
    redirect_to root_path
  end

  def destroy
    logger.info "Entering Users Controller:destroy"
    if (User.exists?(params[:id]))
       @user = User.find(params[:id])
    else
       logger.debug "User Not Found"
       flash[:error] = "User Not Found"
       redirect_to root_path
       return
    end
    @user.destroy
    if (!@user.destroyed?)
       logger.debug "User Not Destroyed"
       addErrorsToFlash(@user.errors)
    end
    if (Company.exists?(params[:company_id]))
      logger.debug "Company Found #{params[:company_id]}"
      redirect_to company_path(params[:company_id]), :method => :show
      return
    end
    logger.info "Leaving Users Controller:destroy"
    redirect_to root_path
  end

  private

    def user_params
      params.require(:user).permit(:email, :isadmin, :role, :user_id, :id, :provider)
    end

    def sort_column
       (Drawing.column_names.include?(params[:sort]) || (params[:sort] == "users.email")) ? params[:sort] : "updated_at"
    end

    def sort_direction
       %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
    end

    def sort_search
       logger.info "Entering Users Controller:sort_search"
       returnval = ""
       if params.has_key?("srch_term")
          returnval = params["srch_term"]
       end
       logger.debug "srch_term: #{returnval}"
       logger.info "Leaving Users Controller:sort_search"
       returnval
    end

    def check_for_cancel
      session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
      if params[:button] == "Cancel"
        redirect_to session.delete(:return_to)
      end
    end

    def addErrorsToFlash(errors)
      logger.info "Entering Users Controller:addErrorsToFlash"
      errors.each do |key, val|
        logger.debug "key: #{key}, val: #{val}"
        flash[key] = val;
      end
      logger.info "Leaving Users Controller:addErrorsToFlash"
    end

end
