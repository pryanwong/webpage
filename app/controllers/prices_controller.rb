class PricesController < ApplicationController
  load_and_authorize_resource :price
  before_filter :check_for_cancel, :only => [:create, :update]
  layout :pages_layout
  def productconfig
  end

  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    #logger.fatal "Session Vals in New: #{session.inspect}"
    if (Company.exists?(id: params[:company_id]))
      @company = Company.find(params[:company_id])
      @price   = Price.new
    else
       flash[:error] = "Company Could Not Be Found"
       redirect_to company_path(session[:company_id])
    end
  end

  def create
    @price = Price.new(price_params)
    @price.company_id = params[:company_id]
    @price.version = 1
    if @price.save
          # Handle a successful update.
      flash[:notice] = "New Product Pricing Saved"
    else
      addErrorsToFlash(@price.errors)
      flash[:error] = "Product Pricing Could Not Be Added"
    end

    redirect_to company_path(session[:company_id])
  end

  def destroy
    logger.fatal "Product Price DESTROY Params: #{params.inspect}"
    if Price.exists?(id: params[:id])
       @price = Price.find(params[:id])
    else
       flash[:error] = "Price Not Deleted, Price Not Found"
       redirect_to company_path(params[:company_id])
       return
    end
    @price.destroy
    if @price.destroyed?
      flash[:notice] = "Price Removed"
    else
      addErrorsToFlash(@price.errors)
    end
    redirect_to company_path(params[:company_id])
  end

  def edit
    logger.fatal "Product Price Edit Parameters: #{params.inspect}"
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    if (!Company.exists?(id: params[:company_id]))
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
    end
    if (!Price.exists?(id: params[:id]))
      flash[:error] = "Price ID not valid"
      redirect_to company_path(session[:company_id])
    end
    @company = Company.find(params[:company_id])
    @price = Price.find(params[:id])
  end

  def update
    if (!Company.exists?(id: params[:company_id]))
      flash[:error] = "Company ID not valid"
      redirect_to user_path(session[:user_id])
      return
    end
    if (!Price.exists?(id: params[:id]))
      flash[:error] = "Product Price ID not valid"
      redirect_to company_path(params[:company_id])
      return
    end

    @company = Company.find(params[:company_id])
    @price = Price.find(params[:id])
    @price.update(name: params[:price][:name], price: params[:price][:price])
    addErrorsToFlash(@price.errors)
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
     params.require(:price).permit(:name, :price)
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
       flash[key] = val;
     end
   end

end
