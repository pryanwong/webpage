class DivisionsController < ApplicationController
  load_and_authorize_resource :division
  before_filter :check_for_cancel, :only => [:create, :update]
  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    logger.fatal "Session Vals in New: #{session.inspect}"
    @company = Company.find(params[:company_id])
    @division = @company.divisions.build
  end

  def edit
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    logger.fatal "Session Vals in Edit: #{session.inspect}"
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
  end

  def adduser
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
    render 'adduser'
  end

  def adduserdiv
    @company = Company.find(params[:company_id])
    @division = Division.find(params[:id])
    @user = User.find(params[:division][:id])
    @division.users << @user
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def update_user
    logger.fatal "Params all: #{params.inspect}"
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def update

    @company = Company.new
    division = Division.new
    #Verify that Company id is valid
    company_valid, company_errors = @company.companyValid(params[:company_id])
    if (!company_valid)
      addErrorsToFlash(company_errors)
      redirect_to user_path(session[:user_id])
      return
    end
    div_valid, division_errors = division.validateExistingDivision(params)

    if (!div_valid)
      addErrorsToFlash(division_errors)
      redirect_to company_path(params[:company_id]), :method => :show
      return
    else
      division = Division.find(params[:id])
      div_valid, division_errors = division.updateDivision(params[:division][:name])
      addErrorsToFlash(division_errors)
      redirect_to company_path(params[:company_id]), :method => :show
    end
  end

  def create
    @company = Company.new
    division = Division.new
    #Verify that Company id is valid
    company_valid, company_errors = @company.companyValid(params[:company_id])
    if (!company_valid)
      addErrorsToFlash(company_errors)
      redirect_to user_path(session[:user_id])
      return
    end
    @company = Company.find(params[:company_id])
    div_valid, division_errors = division.validateDivision(params)
    if (!div_valid)
      addErrorsToFlash(company_errors)
      redirect_to company_path(@company), :method => :show
      return
    end
    div_name = params[:division][:name]
    val, errors = division.addDivision(@company, div_name)
    addErrorsToFlash(errors)
    redirect_to company_path(@company), :method => :show
  end

  def destroy
    @division = Division.find(params[:id])
    val, errors = @division.deleteDivision
    addErrorsToFlash(errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  private

    def division_params
      params.require(:division).permit(:name, :share, :company_id)
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
