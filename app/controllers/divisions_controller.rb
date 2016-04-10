class DivisionsController < ApplicationController
  load_and_authorize_resource :division
  #before_filter :check_for_cancel, :only => [:create, :update]
  def new
    logger.info "Entering DivisionsController:new"
    logger.info "Params: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    @company = Company.new
    company_valid(params[:company_id], @company)
    @company = Company.find(params[:company_id])
    @division = @company.divisions.build
    logger.info "Leaving DivisionsController:new"
  end

  def edit
    logger.info "Entering DivisionsController:edit"
    logger.debug "Divisions Edit Parameters: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (!Company.exists?(id: params[:company_id]))
      logger.error "Company ID not valid: #{params[:company_id]}"
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
    end
    if (!Division.exists?(id: params[:id]))
      logger.error "Division ID not valid: #{params[:id]}"
      flash[:error] = "Division ID not valid"
      redirect_to user_path(session[:user_id])
    end
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
    logger.info "Leaving DivisionsController:edit"
  end

  def adduserdiv
    logger.info "Entering DivisionsController:adduserdiv"
    logger.debug "Add User DIV parameters: #{params.inspect}"
    if User.exists?(id: params[:division][:id])
       logger.debug "User Exists: #{params[:division][:id]}"
       @user = User.find(params[:division][:id])
       logger.debug "User: #{@user.inspect}"
    else
      logger.error "User Not Added to Division, company wasn't found"
      flash[:error] = "User Not Added to Division, company wasn't found"
      redirect_to company_path(params[:company_id]), :method => :show
      return
    end

    if Division.exists?(id: params[:id])
       logger.debug "Division Exists: #{params[:id]}"
       @division = Division.find(params[:id])
    else
       logger.debug "User Not Added to Division, division wasn't found"
       flash[:error] = "User Not Added to Division, division wasn't found"
       redirect_to company_path(params[:company_id]), :method => :show
       return
    end
    userMember = UserMembership.new(:division_id=>@division.id, :user_id=>@user.id)
    successfullyAdded = userMember.save
    if successfullyAdded
       logger.debug "User Has Been Successfully Added to Division"
       flash[:notice] = "User Has Been Successfully Added to Division"
    else
       logger.error "Adding error notices to Flash"
       addErrorsToFlash(userMember.errors)
    end
    logger.info "Leaving DivisionsController:adduserdiv"
    redirect_to company_path(@user.company_id), :method => :show
  end

  def update_user
    logger.info "Entering DivisionsController:update_user"
    redirect_to company_path(params[:company_id]), :method => :show
    logger.info "Leaving DivisionsController:update_user"
  end

  def update
    logger.info "Entering DivisionsController:update"
    if (!Company.exists?(id: params[:company_id]))
      logger.error "Company ID not valid: #{params[:company_id]}"
      flash[:error] = "Company ID not valid"
      logger.info "Leaving DivisionsController:update"
      redirect_to user_path(session[:user_id])
      return
    end
    if (!Division.exists?(id: params[:id]))
      logger.error "Division ID not valid: #{params[:id]}"
      flash[:error] = "Division ID not valid"
      logger.info "Leaving DivisionsController:update"
      redirect_to user_path(session[:user_id])
      return
    end
    logger.debug "Params: #{params.inspect}"
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
    @division.update(name: params[:division][:name])
    addErrorsToFlash(@division.errors)
    logger.info "Leaving DivisionsController:update"
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def create
    logger.info "Entering DivisionsController:create"
    logger.debug "Params: #{params.inspect}"
    @company = Company.new
    division = Division.new

    #Verify that Company id is valid
    if (!Company.exists?(id: params[:company_id]))
      logger.debug "Company ID not valid: #{params[:company_id]}"
      flash[:error] = "Company ID not valid"
      logger.info "Leaving DivisionsController:create"
      redirect_to user_path(session[:user_id])
      return
    end
    @company = Company.find(params[:company_id])
    div_name = params[:division][:name]
    division.name = div_name
    division.company_id = @company.id
    if division.save
       logger.debug "Division Added Successfully"
       flash[:notice] = "Division Added Successfully"
       val = true
    else
       addErrorsToFlash(division.errors)
       logger.error "Division Not Created"
       flash[:not_created] = "Division Not Created"
    end
    logger.info "Leaving DivisionsController:create"
    redirect_to company_path(@company), :method => :show
  end

  def destroy
    logger.info "Entering DivisionsController:destroy"
    logger.debug "Division DESTROY Params: #{params.inspect}"
    if Division.exists?(id: params[:id])
       logger.debug "Division Exists: #{params[:id]}"
       @division = Division.find(params[:id])
    else
       logger.error "Division Not Deleted, Division Not Found"
       flash[:error] = "Division Not Deleted, Division Not Found"
       redirect_to company_path(params[:company_id])
       return
    end
    @division.destroy
    if @division.destroyed?
      logger.debug "Division Removed"
      flash[:notice] = "Division Removed"
    else
      addErrorsToFlash(@division.errors)
    end
    logger.info "Leaving DivisionsController:destroy"
    redirect_to company_path(params[:company_id])
  end

  private

    def division_params
      logger.info "Entering DivisionsController:division_params"
      params.require(:division).permit(:name, :share, :company_id)
      logger.info "Leaving DivisionsController:division_params"
    end

    def company_valid(id, company)
      logger.info "Entering DivisionsController:company_valid"
      if (!Company.exists?(id: id))
        logger.debug "Company ID not valid: #{id}"
        flash[:error] = "Company ID not valid"
        redirect_to user_path(session[:user_id])
      end
      logger.info "Leaving DivisionsController:company_valid"
    end

    def division_valid(id,  division)
      logger.info "Entering DivisionsController:division_valid"
      if (!Division.exists?(id: id))
        logger.debug "Division ID not valid: #{id}"
        flash[:error] = "Division ID not valid"
        redirect_to user_path(session[:user_id])
      end
      logger.info "Leaving DivisionsController:division_valid"
    end

    def div_comp_validate(div_id, comp_id, division_in, company_in)
      logger.info "Entering DivisionsController:div_comp_validate"
      logger.debug "Div_id: #{div_id}"
      logger.debug "comp_id: #{comp_id}"
      logger.debug "division_in: #{division_in}"
      logger.debug "company_in: #{company_in}"
      company_valid(comp_id, company_in)
      company = Company.find(comp_id)
      division_valid(div_id, division_in)
      division = Division.find(div_id)
      logger.debug "Returning:"
      logger.debug "Division: #{division.inspect}"
      logger.debug "company: #{company.inspect}"
      logger.info "Leaving DivisionsController:div_comp_validate"
      return [division, company]
    end

    def check_for_cancel
      logger.info "Entering DivisionsController:check_for_cancel"
      logger.fatal "In Check_for_cancel Vals: #{session.inspect}"
      session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
      if params[:button] == "Cancel"
        redirect_to session.delete(:return_to)
      end
      logger.info "Leaving DivisionsController:check_for_cancel"
    end

    def addErrorsToFlash(errors)
      logger.info "Entering DivisionsController:addErrorsToFlash"
      logger.debug "Key Value Pairs"
      errors.each do |key, val|
        logger.debug "#{key} : #{val}"
        flash[key] = val;
      end
      logger.info "Leaving DivisionsController:addErrorsToFlash"
    end

end
