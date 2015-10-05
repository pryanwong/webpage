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
       if @drawing.drawing == nil || @drawing.drawing.length == 0
          @drawing.drawing = "{}"
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
end
