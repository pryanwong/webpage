class DrawingsController < ApplicationController
  before_filter(:only => [:index, :show]) { authorize if can? :read, :drawing }
  respond_to :json, :html
  load_and_authorize_resource
  before_filter :check_for_cancel, :only => [:updatedrawingdetails]
  layout :resolve_layout

  def index
       @user = User.find(session[:id])
       @drawings = @user.drawings
  end

  def edit
       logger.fatal "In edit Drawing Controller"
       logger.fatal "Session Data #{session.inspect}"
       @drawing = Drawing.find(params[:id])
       if (@drawing.user_id == session[:user_id])
          logger.fatal "Drawing_controller:edit user_id matches drawing"
       end
       #else
        #     redirect_to failed_path
       #end
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
    @drawing.png = ""
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
    @drawing.png     = params[:png]
    logger.fatal "Drawing Vals: #{@drawing.drawing}"
    logger.fatal "Drawing png: #{@drawing.png}"
       if @drawing.save
         render :json => [ @drawing].to_json
       else
         render :json => [{ :error => "An error was encountered while processing your photos. Please try again." }], :status => 304
       end
  end

  def displayimage
     drawing = Drawing.find(params[:id])
     @png = drawing.png
  end

  def getimage
     logger.fatal "Looking at drawing #{params[:id]}"
     drawing = Drawing.find(params[:id])
     png = drawing.png
     logger.fatal "Looking at png #{png}"
     justpngdata = png.slice(png.index(",")+1..-1)
     logger.fatal "Made it past justpngdata"
     decodedImage = Base64.decode64(justpngdata)
     logger.fatal "decoded Image"
     send_data decodedImage, :type => 'image/png',:disposition => 'inline'
  end

  def show_image
      drawing = Drawing.find(params[:id])
      @png = drawing.png
      @companyid = params[:company_id]
      @userid = params[:user_id]
      @drawingid = params[:id]
      @viewpng = true
  end

  def send_image_form
      @message = MessageImage.new
      @message.company_id = params[:company_id]
      @message.user_id = params[:user_id]
      @message.drawing_id = params[:id]
  end

  def send_image
    logger.fatal "Inspect Params"
    logger.fatal "#{params.inspect}"
    @message = MessageImage.new
    @message.company_id = params[:company_id]
    @message.user_id = params[:user_id]
    @message.drawing_id = params[:id]
    @message.email1 = params[:message_image][:email1]
    @message.email2 = params[:message_image][:email2]
    @message.email3 = params[:message_image][:email3]
    @message.email4 = params[:message_image][:email4]
    logger.fatal "Inspect Message"
    logger.fatal "#{@message.inspect}"
    if @message.valid?
      MessageImageMailer.new_message(@message).deliver
      redirect_to edit_company_user_drawing_path(params[:company_id] ,params[:user_id],params[:id] ), notice: "Your messages has been sent."
    else
      flash[:alert] = "An error occurred while delivering this message."
      redirect_to edit_company_user_drawing_path(params[:company_id] ,params[:user_id],params[:id] )
    end

  end

  private

    def drawing_params
      params.permit(:customer, :opportunity, :description, :png)
    end

    def check_for_cancel
      if params[:button] == "Cancel"
        redirect_to edit_company_user_drawing_path
      end
    end

    def resolve_layout
       case action_name
          when "displayimage"
             "nolayout"
          else
             "application"
          end
  end

end
