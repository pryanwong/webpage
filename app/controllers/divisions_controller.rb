class DivisionsController < ApplicationController
  def new
    @company = Company.find(params[:company_id])
    @division = @company.divisions.build
  end

  def edit
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
    @division = Division.find(params[:id])
    @division.company_id = params[:company_id]
    if @division.update_attributes(division_params)
      # Handle a successful update.
      flash[:notice] = "Edit Saved"
      redirect_to company_path(params[:company_id]), :method => :show
    else
      render 'edit'
    end
  end

  def create
    @company = Company.find(params[:company_id])
    @division = @company.divisions.build(division_params)
    if @division.save
      # Handle a successful update.
      flash[:notice] = "New Company Saved"
      redirect_to company_path(@company), :method => :show
     else
       flash[:notice] = "Company Could Not Be Added"
       render action: "new"
     end
  end

  def destroy
    @division = Division.find(params[:id])
    if @division.destroy
       flash[:notice] = "Division Removed"
       redirect_to company_path(params[:company_id])
    end
  end

  private

    def division_params
      params.require(:division).permit(:name, :share, :company_id)
    end
end
