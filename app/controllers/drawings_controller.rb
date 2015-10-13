class DrawingsController < ApplicationController
  #before_filter(:only => [:index, :show]) { authorize if can? :read, :drawing }
  load_and_authorize_resource :company
  load_and_authorize_resource :user
  load_and_authorize_resource :user, :through => :company
  load_and_authorize_resource :drawing, :through => :user
  respond_to :json, :html

  def index
       @user = User.find(params[:id])
       @drawings = @user.drawings
  end

  def edit
       @drawing = Drawing.find(params[:id])
       @editdetails = true;
       if @drawing.drawing == nil || @drawing.drawing.length == 0
          @drawing.drawing = "{}"
       end
  end


  def editdrawingdetails
       @user = User.find(params[:user_id])
       @company = Company.find(params[:company_id])
       @drawing = Drawing.find(params[:id])
       render 'editdrawingdetails'
  end

  def updatedrawingdetails
      logger.fatal "Params Inspect updatedrawingdetails #{params.inspect}"
      @drawing = Drawing.find(params[:id])
      @user = User.find(params[:user_id])
      @company = Company.find(params[:company_id])
      #@drawing.opportunity = params[:drawing][:opportunity]
      #@drawing.customer = params[:drawing][:customer]
      #@drawing.description = params[:drawing][:description]
      if @drawing.update_attributes(drawing_params)
        flash[:notice] = "Edit Saved"
        redirect_to edit_company_user_drawing_path(@company.id, @user, @drawing)
      else
        render 'editdrawingdetails'
      end

  end

  def create
    @drawing = Drawing.new
    @drawing.customer = params[:customer]
    @drawing.description = params[:description]
    @drawing.user_id = params[:user_id]
    @drawing.opportunity = params[:opportunity]
    @drawing.drawing = ""
    if @drawing.save
      # Handle a successful update.
      flash[:notice] = "New Drawing Saved"
      redirect_to edit_company_user_drawing_path(@drawing.user.company.id, @drawing.user, @drawing)
     else
       flash[:notice] = "Drawing Could Not Be Added"
       render action: company_user_path
     end
  end

  def update
    logger.fatal "Drawing Vals: #{params.inspect}"
    @drawing = Drawing.find(params[:id])
    @drawing.drawing = params[:drawing].to_json

    logger.fatal "Drawing Vals: #{@drawing.drawing}"
       if @drawing.save
         render :json => [ @drawing].to_json
       else
         render :json => [{ :error => "An error was encountered while processing your photos. Please try again." }], :status => 304
       end
  end

  private

    def drawing_params
      params.require(:drawing).permit(:customer, :opportunity, :description)
    end

end
