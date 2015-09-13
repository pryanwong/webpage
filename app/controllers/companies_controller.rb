class CompaniesController < ApplicationController
  load_and_authorize_resource :company
  def new
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
end
