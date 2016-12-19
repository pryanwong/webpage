 class CompaniesController < ApplicationController
  #before_filter(:only => [:new]) { authorize if can? :create, :company }
  load_and_authorize_resource :company, :raise_on_record_not_found => false
  #before_filter :check_for_cancel, :only => [:create, :update]
  def new
    logger.info "Entering CompaniesController:new"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    #logger.fatal "Session Vals in New: #{session.inspect}"
    @company = Company.new
    logger.debug "New company: #{@company.inspect}"
    logger.info "Leaving  CompaniesController:new"
    authorize! :new, @company
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
       flash[:error] = t('flash.companies.company_not_found')
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
       flash[:error] = t('flash.companies.company_not_found')
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
            flash[:notice] = t('flash.companies.edit_saved')
          else
            addErrorsToFlash(@company.errors)
            logger.error "Company Could Not Be Updated"
            flash[:error] = t('flash.companies.not_updated')
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
      flash[:notice] = t('flash.companies.new_company_saved')
    else
      addErrorsToFlash(@company.errors)
      logger.error "Company Could Not Be Added"
      logger.error "errors: #{@company.inspect}"
      flash[:error] = t('flash.companies.could_not_be_added')
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
         flash[:notice] = t('flash.companies.has_been_removed')
       else
         logger.debug "errors: #{@company.inspect}"
         addErrorsToFlash(@company.errors)
       end
    else
       logger.error "Company ID not found"
       flash[:error] = t('flash.companies.company_id_not_found')
    end
    logger.info "Leaving CompaniesController:destroy"
    redirect_to companies_path
  end

  def get_json_icon_gallery
    if (params[:company_id] == current_user.company_id.to_s)
       logger.info "Entering Drawing#get_json_icon_gallery"
       data = File.read("#{Rails.root}/app/views/drawings/icons/#{params[:company_id]}.json")
       hash = JSON.parse(data)
       # get main object in JSON data
       panels = hash["objects"]
       # now we have to iterate through the array of panel-collapse
       panels.each do |panel|
         # we have to get the icons (in sub arrays of 2) and update
         icons = panel["icons"]
         icons.each do |iconcollection|
           iconcollection.each do |icon|
              iconloc = icon["data_loc"]
              icon["image_tag"] = ActionController::Base.helpers.asset_path(iconloc)
           end
         end
       end
       logger.info "Leaving Drawing#get_json_icon_gallery"
       render :json => hash
    else
      logger.error "No Company found"
      flash[:error] = t('flash.drawings.company_not_found')
      render :json => '{"error":"No Company JSON Icon Gallery Found"}'
      return
    end
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
