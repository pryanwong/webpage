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
    @company = Company.new
    @division = Division.new

    @division, @company = div_comp_validate(params[:id], params[:company_id],@division, @company)

  end

  def adduserdiv
    @company = Company.new
    @division = Division.new
    @user = User.new
    userErrors = {}
    user_valid, user_errors = @user.userValid(params[:division][:id])
    addErrorsToFlash(user_errors)
    if user_valid
       @user = User.find(params[:division][:id])
    else
       redirect_to company_path(params[:company_id]), :method => :show
    end

    division_valid(params[:division][:id], @division )
    @division = Division.find(params[:id])
    # @division.users << @user
    if (UserMembership.membershipExists(@division.id, @user.id).length == 0)
       userMember = UserMembership.new(:division_id=>@division.id, :user_id=>@user.id)
       successfullyAdded = userMember.save!
       if successfullyAdded
         userErrors[:notice] = "User Has Been Successfully Added to Division"
       else
         if (!userMember.errors.empty?)
            userMember.errors.each do |attr,err|
              userErrors[attr] = err.to_s()
            end
         end
         userErrors[:could_not_update] = "Could Not Update User"
       end
    else
       userErrors[:errors] = "User already in Division "
    end
    addErrorsToFlash(userErrors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def update_user
    #logger.fatal "Params all: #{params.inspect}"
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def update

    @company = Company.new
    @division = Division.new
    @division, @company = div_comp_validate(params[:id], params[:company_id],@division, @company)
    div_valid, division_errors = @division.updateDivision(params[:division][:name])
    addErrorsToFlash(division_errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  def create
    @company = Company.new
    division = Division.new

    #Verify that Company id is valid
    company_valid(params[:company_id], @company)
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
    @division = Division.new
    division_valid(params[:id], @division)
    @division = Division.find(params[:id])
    val, errors = @division.deleteDivision
    addErrorsToFlash(errors)
    redirect_to company_path(params[:company_id]), :method => :show
  end

  private

    def division_params
      params.require(:division).permit(:name, :share, :company_id)
    end

    def company_valid(id, company)
      comp_valid, company_errors = company.companyValid(id)
      if (!comp_valid)
        addErrorsToFlash(company_errors)
        redirect_to user_path(session[:user_id])
      end
    end

    def division_valid(id,  division)
      div_valid, division_errors = division.validateExistingDivision(id)
      if (!div_valid)
        addErrorsToFlash(division_errors)
        redirect_to user_path(session[:user_id])
      end
    end

    def div_comp_validate(div_id, comp_id, division, company)
      company_valid(comp_id, company)
      company = Company.find(comp_id)
      division_valid(div_id, division)
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
