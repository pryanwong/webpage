class DivisionsController < ApplicationController
  load_and_authorize_resource :division
  before_filter :check_for_cancel, :only => [:create, :update]
  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    @company = Company.new
    company_valid(params[:company_id], @company)
    @company = Company.find(params[:company_id])
    @division = @company.divisions.build
  end

  def edit
    logger.fatal "Divisions Edit Parameters: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (!Company.exists?(id: params[:company_id]))
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
    end
    if (!Division.exists?(id: params[:id]))
      flash[:error] = "Division ID not valid"
      redirect_to user_path(session[:user_id])
    end
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
  end

  def adduserdiv
    logger.fatal "Add User DIV parameters: #{params.inspect}"
    if User.exists?(id: params[:division][:id])
       @user = User.find(params[:division][:id])
    else
      flash[:error] = "User Not Added to Division, company wasn't found"
      redirect_to company_path(params[:company_id]), :method => :show
      return
    end

    if Division.exists?(id: params[:id])
       @division = Division.find(params[:id])
    else
       flash[:error] = "User Not Added to Division, division wasn't found"
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    userMember = UserMembership.new(:division_id=>@division.id, :user_id=>@user.id)
    successfullyAdded = userMember.save
    if successfullyAdded
       flash[:notice] = "User Has Been Successfully Added to Division"
    else
       addErrorsToFlash(userMember.errors)
    end
    redirect_to company_path(@user.company_id), :method => :show
  end

  def update_user
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def update
    if (!Company.exists?(id: params[:company_id]))
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
      return
    end
    if (!Division.exists?(id: params[:id]))
      flash[:error] = "Division ID not valid"
      redirect_to user_path(session[:user_id])
      return
    end

    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
    @division.update(name: params[:division][:name])
    addErrorsToFlash(@division.errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def create
    @company = Company.new
    division = Division.new

    #Verify that Company id is valid
    if (!Company.exists?(id: params[:company_id]))
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
      return
    end
    @company = Company.find(params[:company_id])
    div_name = params[:division][:name]
    division.name = div_name
    division.company_id = @company.id
    if division.save
       flash[:notice] = "Division Added Successfully"
       val = true
    else
       addErrorsToFlash(division.errors)
       flash[:not_created] = "Division Not Created"
    end
    redirect_to company_path(@company), :method => :show
  end

  def destroy
    logger.fatal "Division DESTROY Params: #{params.inspect}"
    if Division.exists?(id: params[:id])
       @division = Division.find(params[:id])
    else
       flash[:error] = "Division Not Deleted, Division Not Found"
       redirect_to company_path(params[:company_id])
       return
    end
    @division.destroy
    if @division.destroyed?
      flash[:notice] = "Division Removed"
    else
      addErrorsToFlash(@division.errors)
    end
    redirect_to company_path(params[:company_id])
  end

  private

    def division_params
      params.require(:division).permit(:name, :share, :company_id)
    end

    def company_valid(id, company)
      if (!Company.exists?(id: id))
        flash[:error] = "Company ID not valid"
        redirect_to user_path(session[:user_id])
      end
    end

    def division_valid(id,  division)
      if (!Division.exists?(id: id))
        flash[:error] = "Division ID not valid"
        redirect_to user_path(session[:user_id])
      end
    end

    def div_comp_validate(div_id, comp_id, division_in, company_in)
      company_valid(comp_id, company_in)
      company = Company.find(comp_id)
      division_valid(div_id, division_in)
      division = Division.find(div_id)
      return [division, company]
    end

    def check_for_cancel
      logger.fatal "In Check_for_cancel Vals: #{session.inspect}"
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
