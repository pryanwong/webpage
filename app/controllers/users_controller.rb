class UsersController < ApplicationController
  helper_method :sort_column, :sort_direction
  load_and_authorize_resource :company
  load_and_authorize_resource :user
  load_and_authorize_resource :user, :through => :company
  before_filter :check_for_cancel, :only => [:newdrawingproc]

  def new
    @company = Company.find(params[:company_id])
    @user = User.new
    @user.company = @company
  end

  def show
    @user = User.find(params[:id]);
    @listdrawings = false;
    if (@user.drawings.size > 0)
      @listdawings = true;
      @userdrawings = Drawing.where("user_id = ?",params[:id]).order(sort_column + " " + sort_direction).paginate(page: params[:page], per_page: 10)
    end
  end

  def edit
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
       params.merge(:user_id => @user.id)
  end

  def newdrawingproc
       logger.fatal "Drawing Object #{params.inspect}"
       @user = User.find(params[:id])
       @company = Company.find(@user.company_id)
       @drawing = Drawing.new
       logger.fatal "Params Inspect newdrawingproc #{params.inspect}"
       @drawing.customer = params[:drawing][:customer]
       @drawing.opportunity = params[:drawing][:opportunity]
       @drawing.description = params[:drawing][:description]
       params.merge(:id => @user.id)
       logger.fatal "Drawing Object #{@drawing.inspect}"
       redirect_to company_user_drawing_path(@company.id, @user.id, {:id => @user.id, :customer => params[:drawing][:customer], :opportunity => params[:drawing][:opportunity], :description => params[:drawing][:description]})
  end

  def update
    @user = User.find(params[:id])
    #assign role_id
    #logger.fatal "Params isadmin value #{params[:user][:isadmin]}"
    #logger.fatal "Params all: #{params.inspect}"
    if params[:user][:isadmin].to_i == 1
       #logger.fatal "Is Admin True: Changing Role_id to 2"
       @user.role_id = 2
    else
       #logger.fatal "Is Admin False: Changing Role_id to 1"
       @user.role_id = 1
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
       val = 2
    else
       #logger.fatal "Is Admin False: Changing Role_id to 1"
       val = 1
    end

    #logger.fatal "Number of Users at Company: #{@company.users.size}"
    #logger.fatal "Number of Licenses: #{@company.licenses}"
    if (@company.users.size < @company.licenses && !User.exists?(email: params[:user][:email]))
      if (@user = User.create(email: params[:user][:email], role_id: val, isadmin: params[:user][:isadmin]))
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
      params.require(:user).permit(:email, :isadmin, :role_id)
    end

    def sort_column
       Drawing.column_names.include?(params[:sort]) ? params[:sort] : "customer"
    end

    def sort_direction
       %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
    end

    def check_for_cancel
      if params[:button] == "Cancel"
        redirect_to company_user_path
      end
    end

end
