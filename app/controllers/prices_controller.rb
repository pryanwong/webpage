class PricesController < ApplicationController
  respond_to :json, :html
  load_and_authorize_resource :price
  #before_filter :check_for_cancel, :only => [:create, :update]
  layout :pages_layout
  def productconfig
    logger.info "Entering PricesController#productconfig"
    logger.debug "In Product Config"
    logger.debug "#{params.inspect}"
    logger.debug "Product Id: #{params[:product_id]}"
    if(params.has_key?(:product_id) && params.has_key?(:company_id))
       logger.debug "Record exists: #{params[:product_id]}"
       if (Price.where(company_id: params[:company_id],product_id: params[:product_id]).count>0)
          logger.debug "productconfig Price Id: #{params[:product_id]}"
          @price   = Price.where(company_id: params[:company_id],product_id: params[:product_id]).take
          logger.debug "#{@price.inspect}"
       else
          logger.error "Product Config Could Not Be Found"
          flash[:error] = t('flash.prices.price_config_not_found')
          @price   = Price.New
       end
    else
      @price   = Price.New
    end
    logger.info "Leaving PricesController#productconfig"
    render :json => @price
  end

  def new
    logger.info "Entering PricesController#new"
    logger.debug "Params: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    #logger.fatal "Session Vals in New: #{session.inspect}"
    if (Company.exists?(id: params[:company_id]))
      logger.debug "Company Exists: #{params[:company_id]}"
      @company = Company.find(params[:company_id])
      @price   = @company.prices.build
    else
       logger.error "Company Could Not Be Found: #{params[:company_id]}"
       flash[:error] = t('flash.prices.company_not_found')
       redirect_to company_path(session[:company_id])
    end
    logger.info "Leaving PricesController#new"
  end

  def create
    logger.info "Entering PricesController#create"
    logger.debug "params: #{params.inspect}"
    @price = Price.new(price_params)
    @price.company_id = params[:company_id]
    @price.version = 1
    if @price.save
      logger.debug "New Product Pricing Saved"
      flash[:notice] = t('flash.prices.new_pricing_saved')
    else
      addErrorsToFlash(@price.errors)
      logger.error "Product Pricing Could Not Be Added"
      flash[:error] = t('flash.prices.pricing_not_added')
    end
    logger.info "Leaving PricesController#create"
    redirect_to company_path(params[:company_id])
  end

  def destroy
    logger.info "Entering PricesController#destroy"
    logger.debug "Params: #{params.inspect}"
    if Price.exists?(id: params[:product_id])
       logger.debug "Price Found: #{params[:product_id]}"
       @price = Price.find(params[:product_id])
    else
       logger.error "Price Not Deleted, Price Not Found"
       flash[:error] = t('flash.prices.pricing_not_deleted')
       logger.info "Leaving PricesController#destroy"
       redirect_to company_path(params[:company_id])
       return
    end
    @price.destroy
    if @price.destroyed?
      logger.debug "Price Removed"
      flash[:notice] = t('flash.prices.pricing_removed')
    else
      addErrorsToFlash(@price.errors)
    end
    logger.info "Leaving PricesController#destroy"
    redirect_to company_path(params[:company_id])
  end

  def edit
    logger.info "Entering PricesController#edit"
    logger.debug "Parameters: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (!Company.exists?(id: params[:company_id]))
      logger.error "Company ID not valid: #{params[:company_id]}"
      flash[:error] = t('flash.prices.company_not_found')
      redirect_to user_path(session[:user_id])
      return
    end
    if (!Price.exists?(id: params[:product_id]))
      logger.error "Price ID not valid: #{params[:product_id]}"
      flash[:error] = t('flash.prices.pricing_not_found')
      redirect_to company_path(session[:company_id])
      return
    end
    logger.info "Leaving PricesController#edit"
    @company = Company.find(params[:company_id])
    @price = Price.find_by_id(params[:product_id])
  end

  def update
    logger.info "Entering PricesController#update"
    logger.debug "Parameters: #{params.inspect}"
    if (!Company.exists?(id: params[:company_id]))
      logger.error "Company ID not valid: #{params[:company_id]}"
      flash[:error] = t('flash.prices.company_not_found')
      redirect_to user_path(session[:user_id])
      return
    end
    if (!Price.exists?(id: params[:product_id]))
      logger.error "Product Price ID not valid: #{params[:product_id]}"
      flash[:error] = t('flash.prices.pricing_not_found')
      redirect_to company_path(params[:company_id])
      return
    end

    @company = Company.find(params[:company_id])
    @price = Price.find_by_id(params[:product_id])
    @price.update(name: params[:price][:name], price: params[:price][:price], version: params[:price][:version], product_id: params[:price][:product_id])

    addErrorsToFlash(@price.errors)
    logger.info "Leaving PricesController#update"
    redirect_to company_path(params[:company_id]), :method => :show
  end

  private
   def pages_layout
     case action_name
       when "productconfig"
          "nolayout"
       else
          "application"
       end
   end

   def price_params
     params.require(:price).permit(:product_id, :name, :price, :version)
   end

   def check_for_cancel
     logger.fatal "In Check_for_cancel Vals: #{session.inspect}"
     session[:return_to] ||= company_path(session[:company_id])
     if params[:button] == "Cancel"
       redirect_to session.delete(:return_to)
     end
   end

   def addErrorsToFlash(errors)
     errors.each do |key, val|
       logger.debug "#{key} : #{val}"
       flash[key] = val;
     end
   end

end
