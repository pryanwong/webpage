 class CompaniesController < ApplicationController
  load_and_authorize_resource :company, :raise_on_record_not_found => false
  #before_filter :check_for_cancel, :only => [:create, :update]
  def new
    logger.info "Entering CompaniesController:new"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    #logger.fatal "Session Vals in New: #{session.inspect}"
    @company = Company.new
    logger.debug "New company: #{@company.inspect}"
    logger.info "Leaving CompaniesController:new"
  end

  def index
    logger.info "Entering CompaniesController:index"
    if current_user.admin?
       logger.debug "current_user.admin"
       @companies = Company.all
       logger.debug "Companies: #{@companies.inspect}"
    elsif current_user.moderator?
       logger.info "current_user.moderator"
       temp = current_user.company
       @companies = [temp]
       logger.debug "Companies: #{@companies.inspect}"
    end
    logger.info "Leaving CompaniesController:index"
  end

  def show
    logger.info "Entering CompaniesController:show"
    if (Company.exists?(id: params[:id]))
      logger.debug "Company exists: #{params[:id]}"
      @company = Company.find(params[:id])
      logger.debug "Company: #{@company.inspect}"
    else
       logger.debug "Company Could Not Be Found"
       flash[:error] = "Company Could Not Be Found"
       logger.info "Leaving CompaniesController:show"
       redirect_to companies_path
    end
    logger.info "Leaving CompaniesController:show"
  end

  def edit
    logger.info "Leaving CompaniesController:edit"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (Company.exists?(id: params[:id]))
       logger.debug "Company exists: #{params[:id]}"
       @company = Company.find(params[:id])
       logger.debug "Company: #{@company.inspect}"
    else
       logger.error "Company Could Not Be Found"
       flash[:error] = "Company Could Not Be Found"
       logger.info "Leaving CompaniesController:edit"
       redirect_to companies_path
    end
    logger.info "Leaving CompaniesController:edit"
  end

  def update
    logger.info "Leaving CompaniesController:update"
    if (Company.exists?(id: params[:id]))
          logger.debug "Company exists: #{params[:id]}"
          @company = Company.find(params[:id])
          logger.debug "Company: #{@company.inspect}"
          if @company.update_attributes(company_params)
            logger.debug "Company Edit Saved"
            flash[:notice] = "Edit Saved"
          else
            addErrorsToFlash(@company.errors)
            logger.error "Company Could Not Be Updated"
            flash[:error] = "Company Could Not Be Updated"
          end
    end
    addErrorsToFlash(@company.errors)
    logger.info "Leaving CompaniesController:update"
    redirect_to companies_path
  end

  def create
    logger.info "Entering CompaniesController:create"
    logger.debug "Company params:  #{params.inspect}"
    @company = Company.new(company_params)
    if @company.save
          # Handle a successful update.
      logger.debug "New Company Saved"
      flash[:notice] = "New Company Saved"
    else
      addErrorsToFlash(@company.errors)
      logger.error "Company Could Not Be Added"
      logger.error "errors: #{@company.inspect}"
      flash[:error] = "Company Could Not Be Added"
    end
    logger.info "Leaving CompaniesController:create"
    redirect_to companies_path

  end

  def destroy
    logger.info "Entering CompaniesController:destroy"
    if Company.exists?(id: params[:id])
       logger.debug "Company exists: #{params[:id]}"
       @company = Company.find(params[:id])
       if @company.destroy
         flash[:notice] = "Company has been removed"
       else
         logger.debug "errors: #{@company.inspect}"
         addErrorsToFlash(@company.errors)
       end
    else
       logger.error "Company ID not found"
       flash[:error] = "Company ID not found"
    end
    logger.info "Leaving CompaniesController:destroy"
    redirect_to companies_path
  end

  private

    def company_params
      params.require(:company).permit(:name, :licenses, :portal)
    end

    def check_for_cancel
      logger.info "Entering CompaniesController:check_for_cancel"
      logger.debug "Session Vals in check_for_cancel: #{session.inspect}"
      logger.debug "Return to val #{session[:return_to]}"
      logger.debug "Params: #{params.inspect}"
      session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
      if params[:button] == "Cancel"
        redirect_to session.delete(:return_to)
      end
      logger.info "Leaving CompaniesController:check_for_cancel"
    end

    def addErrorsToFlash(errors)
      logger.info "Entering CompaniesController:addErrorsToFlash"
      errors.each do |key, val|
        logger.error "Errors:  #{val}"
        flash[key] = val;
      end
      logger.info "Leaving CompaniesController:addErrorsToFlash"
      flash
    end

end
