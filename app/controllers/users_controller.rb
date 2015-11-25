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
    if sort_column == "users.email"
      if @user.admin?
         @userdrawings = Drawing.includes(:user).all.order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
      elsif @user.moderator?
         @userdrawings = Drawing.includes(:user).where("(user_id = ?) or (drawings.company_id = ?)", @user.id, @user.company_id).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
      else @user.user?
         @userdrawings = Drawing.includes(:user).where("(user_id = ?) or (privacy = ? and division_id IN (?)) or (privacy = ? and drawings.company_id = ?)", @user.id, Drawing.privacies["division"], @divs, Drawing.privacies["company"], @user.company_id).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
      end
    else
       if @user.admin?
          @userdrawings = Drawing.all.order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
       elsif @user.moderator?
          @userdrawings = Drawing.where("(user_id = ?) or (company_id = ?)", @user.id, @user.company_id).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
       else @user.user?
          @userdrawings = Drawing.where("(user_id = ?) or (privacy = ? and division_id IN (?)) or (privacy = ? and company_id = ?)", @user.id, Drawing.privacies["division"], @divs, Drawing.privacies["company"], @user.company_id).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
       end
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
       logger.fatal "priv_level is #{priv_level}"
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
    @user = User.find(params[:id])
    #assign role_id
    #logger.fatal "Params isadmin value #{params[:user][:isadmin]}"
    #logger.fatal "Params all: #{params.inspect}"
    if params[:user][:isadmin].to_i == 1
       #logger.fatal "Is Admin True: Changing Role_id to 2"
       @user.role = :moderator
    else
       #logger.fatal "Is Admin False: Changing Role_id to 1"
       @user.role = :user
    end
    @user.company = Company.find(params[:company_id])
    @user.isadmin = params[:user][:isadmin]
    @user.email = params[:user][:email]
    #logger.fatal "User before update save: #{@user.inspect}"
    if @user.save
      # Handle a successful update.
      flash[:notice] = "Edit Saved"
      redirect_to company_path(params[:company_id]), :method => :show
    else
      render 'edit'
    end
  end

  def create
    @company = Company.find(params[:company_id])
    #assign role_id
    #logger.fatal "Params isadmin value #{params[:user][:isadmin]}"
    #logger.fatal "Params all: #{params.inspect}"
    val = 1
    if params[:user][:isadmin].to_i == 1
       #logger.fatal "Is Admin True: Changing Role_id to 2"
       val = User.roles["moderator"]
    else
       #logger.fatal "Is Admin False: Changing Role_id to 1"
       val = User.roles["user"]
    end

    #logger.fatal "Number of Users at Company: #{@company.users.size}"
    #logger.fatal "Number of Licenses: #{@company.licenses}"
    if (@company.users.size < @company.licenses && !User.exists?(email: params[:user][:email]))
      if (@user = User.create(email: params[:user][:email], role: val, isadmin: params[:user][:isadmin]))
        # Handle a successful update.
        flash[:notice] = "New User Saved"
        @user.company = @company
        @user.save
        redirect_to company_path(params[:company_id]), :method => :show
      else
        flash[:notice] = "User Could Not Be Added"
        redirect_to company_path(params[:company_id]), :method => :show
      end
    else
      if User.exists?(email: params[:user][:email])
        flash[:notice] = "User already exists, cannot be added twice"
      else
        flash[:notice] = "User Could Not Be Added, Number of Licenses Exceeded"
      end
      redirect_to company_path(params[:company_id]), :method => :show
    end
  end

  def destroy
    @user = User.find(params[:id])
    if @user.destroy
       flash[:notice] = "User Removed"
       redirect_to company_path(params[:company_id])
    end
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

end
