class UsersController < ApplicationController
  #before_filter(:only => [:index, :show]) { unauthorized! if cannot? :read, :user }
  helper_method :sort_column, :sort_column_user, :sort_direction, :sort_search
  load_and_authorize_resource :user
  #load_and_authorize_resource :drawing
  #before_filter :check_for_cancel, :only => [:newdrawingproc, :create, :update]

  def showall
    @users = User.all.order("email" + " " + sort_direction).paginate(page: params[:page], per_page: 10)
  end

  def switchuser
    if (User.exists?(params[:user_id]))
       @user = User.find(params[:user_id]);
    else
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    if current_user.admin? && !session[:switched] == true
       session[:switched]  = true;
       session[:adminuser] = session[:user_id]
       session[:admincompany] = session[:company_id]
       @current_user = @user
       session.delete(:user_id)
       session.delete(:company_id)
       session[:user_id]  = @user.id
       session[:company_id] = @user.company_id
       redirect_to company_user_path(@user.company_id , @user.id)
       return
    else
       redirect_to company_user_path(session[:company_id] , session[:user_id])
    end
  end

  def switchback
    if (User.exists?(session[:adminuser]))
       @user = User.find(session[:adminuser]);
    else
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    if session[:switched]
       session.delete(:switched)
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
    if (Company.exists?(params[:company_id]))
       @company = Company.find(params[:company_id])
    else
      flash[:error] = "Company not Found"
      redirect_to root_path
      return
    end
    @user = User.new
    @user.company = @company
  end

  def show
    logger.fatal "#{params.inspect}"
    if (User.exists?(params[:id]))
       @user = User.find(params[:id]);
    else
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
    if (params.has_key?("srch_term"))
      searchterm = params["srch_term"].downcase
      @searchVal = params["srch_term"]
    end
    if @user.admin?
         @userdrawings = Drawing.includes(:user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.moderator?
         @userdrawings = Drawing.moderator_access(@user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    elsif @user.user?
         @userdrawings = Drawing.user_access(@user).where("lower(customer) LIKE :query OR lower(opportunity) LIKE :query OR lower(description) LIKE :query", query: "%#{searchterm}%").order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    end
    if (@userdrawings.count > 0 )
       @listdrawings = true;
    end
  end

  def drawsearch
     @searchparam = params[:search]
     @user = User.new
     if (User.exists?(params[:id]))
        @user = User.find(params[:id]);
     else
        flash[:error] = "User not Found"
        redirect_to root_path
        return
     end
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
    if (Company.exists?(params[:company_id]))
       @company = Company.find(params[:company_id]);
    else
       flash[:error] = "Company not Found"
       redirect_to root_path
       return
    end
    if (User.exists?(params[:id]))
       @user = User.find(params[:id]);
    else
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
  end

  def removeuserdiv
    if (Company.exists?(params[:company_id]))
       @company = Company.find(params[:company_id]);
    else
       flash[:error] = "Company not Found"
       redirect_to root_path
       return
    end
    if (Division.exists?(params[:division_id]))
       @division = Division.find(params[:division_id])
    else
      flash[:error] = "Division not Found"
      redirect_to root_path
      return
    end
    if (User.exists?(params[:id]))
       @user = User.find(params[:id]);
    else
       flash[:error] = "User not Found"
       redirect_to root_path
       return
    end
    @user.drawings.where(:division_id => params[:division_id].to_i).update_all(:privacy => Drawing.privacies["company"])
    userMembership = UserMembership.membershipExists(@division.id, @user.id)
    userErrors = {}
    if (userMembership.length == 1)
        successfullyDestroyed = userMembership[0].destroy!
        if successfullyDestroyed
          userErrors[:notice] = "User Has Been Deleted From Division"
        else
          if (!userMembership.errors.empty?)
             userMembership.errors.each do |attr,err|
               userErrors[attr] = err.to_s()
             end
          end
          userErrors[:could_not_update] = "Could Not Remove User From Division"
        end
     else
        userErrors[:errors] = "Could Not Find User In Division"
     end
    addErrorsToFlash(userErrors)
    redirect_to company_path(@company)
  end

  def newdrawing
       if (User.exists?(params[:id]))
          @user = User.find(params[:id]);
       else
          flash[:error] = "User not Found"
          redirect_to root_path
          return
       end
       if (Company.exists?(params[:company_id]))
          @company = Company.find(params[:company_id]);
       else
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
  end

  def newdrawingproc
       if (User.exists?(params[:id]))
          @user = User.find(params[:id]);
       else
          flash[:error] = "User not Found"
          redirect_to root_path
          return
       end
       if (Company.exists?(@user.company_id))
          @company = Company.find(@user.company_id);
       else
          flash[:error] = "Company not Found"
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
       else
         flash[:error] = "Privacy Level not Found"
         redirect_to root_path
         return
       end
       @drawing.division_id = params[:drawing][:division]
       params.merge(:id => @user.id)
       logger.fatal "Drawing Object #{@drawing.inspect}"
       redirect_to company_user_drawing_path(@company.id, @user.id, {:id => @user.id, :customer => @drawing.customer, :opportunity => @drawing.opportunity, :description => @drawing.description, :privacy => @drawing.privacy, :division_id => @drawing.division_id})
  end

  def update

    @user = User.new
    if (User.exists?(id: params[:id]))
       @user = User.find(params[:id])
    else
       flash[:error] = "User Could Not Be Found"
       redirect_to companies_path
       return
    end

    if (!params[:user][:role].blank?)
       if params[:user][:role] == "moderator"
          @user.role = User.roles["moderator"]
       else
          @user.role = User.roles["user"]
       end
    end

    if (!params[:user][:provider].blank?)
       @user.provider = User.providers[params[:user][:provider]]
    else
       @user.provider = 0;
    end

    if (!params[:user][:email].blank?)
       @user.email = params[:user][:email]
    end

    successfullyUpdated = @user.save
    if !successfullyUpdated
       logger.fatal "User update failed #{@user.errors}"
       addErrorsToFlash(@user.errors)
    else
       flash[:notice] = "User Has Been Updated"
    end
    if (Company.exists?(params[:company_id]))
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    redirect_to root_path
  end

  def create
    logger.fatal "User CREATE Params: #{params.inspect}"
    provalue = User.providers[params[:user][:provider]]
    logger.fatal "Provider Value: #{provalue}"
    @company = Company.new
    if (!Company.exists?(id: params[:company_id]))
       flash[:error] = "Company Could Not Be Found"
       redirect_to root_path
       return
    else
       @company = Company.find(params[:company_id])
       role_val = User.roles[(params[:user][:role])]
       successfullyAdded = false;
       userErrors = {}
       @user = User.new(email: params[:user][:email], role: role_val, company_id: params[:company_id], provider: provalue)
       successfullyAdded = @user.save
       if !successfullyAdded
         addErrorsToFlash(@user.errors)
         flash[:error] = "User Has Failed To Be Created"
       else
         flash[:notice] = "User Has Been Created"
       end
    end
    if (!params[:company_id].blank?)
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    redirect_to root_path
  end

  def destroy
    if (User.exists?(params[:id]))
       @user = User.find(params[:id])
    else
       flash[:error] = "User Not Found"
       redirect_to root_path
       return
    end
    @user.destroy
    if (!@user.destroyed?)
       addErrorsToFlash(@user.errors)
    end
    if (Company.exists?(params[:company_id]))
      redirect_to company_path(params[:company_id]), :method => :show
      return
    end
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
       returnval = ""
       if params.has_key?("srch_term")
          returnval = params["srch_term"]
       end
       returnval
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
