class CompaniesController < ApplicationController
  load_and_authorize_resource :company
  before_filter :check_for_cancel, :only => [:create, :update]
  def new
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    logger.fatal "Session Vals in New: #{session.inspect}"
    @company = Company.new
  end

  def index
    if current_user.role? :admin
       @companies = Company.all
    elsif current_user.role? :moderator
       temp = current_user.company
       @companies = [temp]
    end
  end

  def show
    @company = Company.find(params[:id])
  end

  def edit
    session.delete(:return_to)
    session[:return_to] ||= request.referer
    @company = Company.find(params[:id])
  end

  def update
    @company = Company.find(params[:id])
    if @company.update_attributes(company_params)
      # Handle a successful update.
      flash[:notice] = "Edit Saved"
      redirect_to companies_path
    else
      render 'edit'
    end
  end

  def create
    @company = Company.new(company_params)
    if @company.save
      # Handle a successful update.
      flash[:notice] = "New Company Saved"
      redirect_to companies_path
     else
       flash[:notice] = "Company Could Not Be Added"
       render action: "new"
     end
  end

  def destroy
    @company = Company.find(params[:id])
    if @company.destroy
       flash[:notice] = "Company Removed"
       redirect_to companies_path
    end
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

end
