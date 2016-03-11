 class CompaniesController < ApplicationController
  load_and_authorize_resource :company, :raise_on_record_not_found => false
  #before_filter :check_for_cancel, :only => [:create, :update]
  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    #logger.fatal "Session Vals in New: #{session.inspect}"
    @company = Company.new
  end

  def index
    if current_user.admin?
       @companies = Company.all
    elsif current_user.moderator?
       temp = current_user.company
       @companies = [temp]
    end
  end

  def show
    if (Company.exists?(id: params[:id]))
      @company = Company.find(params[:id])
    else
       flash[:error] = "Company Could Not Be Found"
       redirect_to companies_path
    end
  end

  def edit
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (Company.exists?(id: params[:id]))
       @company = Company.find(params[:id])
    else
       flash[:error] = "Company Could Not Be Found"
       redirect_to companies_path
    end
  end

  def update
    if (Company.exists?(id: params[:id]))
          @company = Company.find(params[:id])
          if @company.update_attributes(company_params)
            # Handle a successful update.
            flash[:notice] = "Edit Saved"
          else
            addErrorsToFlash(@company.errors)
            flash[:error] = "Company Could Not Be Updated"
          end
    end
    addErrorsToFlash(@company.errors)
    redirect_to companies_path
  end

  def create
    @company = Company.new(company_params)
    if @company.save
          # Handle a successful update.
      flash[:notice] = "New Company Saved"
    else
      addErrorsToFlash(@company.errors)
      flash[:error] = "Company Could Not Be Added"
    end

    redirect_to companies_path

  end

  def destroy
    if Company.exists?(id: params[:id])
       @company = Company.find(params[:id])
       @company.destroy
       addErrorsToFlash(@company.errors)
    else
       flash[:error] = "Company ID not found"
    end
    redirect_to companies_path
  end

  private

    def company_params
      params.require(:company).permit(:name, :licenses)
    end

    def check_for_cancel
      logger.fatal "Session Vals in check_for_cancel: #{session.inspect}"
      logger.fatal "Return to val #{session[:return_to]}"
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
