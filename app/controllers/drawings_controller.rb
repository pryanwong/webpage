class DrawingsController < ApplicationController
  before_filter(:only => [:index, :show]) { authorize if can? :read, :drawing }
  respond_to :json, :html
  load_and_authorize_resource :drawing
  before_filter :check_for_cancel, :only => [:updatedrawingdetails, :send_image, :send_image_form]
  layout :resolve_layout

  def edit
       @drawing = Drawing.new
       if (Drawing.exists?(params[:id]))
          @drawing = Drawing.find(params[:id]);
       else
          flash[:error] = "Drawing not Found"
          redirect_to root_path
       end
       @editdetails = true;
       if @drawing.drawing == nil || @drawing.drawing.length == 0
          @drawing.drawing = "{}"
       end
  end


  def editdrawingdetails
       if (User.exists?(params[:user_id]))
          @user = User.find(params[:user_id]);
       else
          flash[:error] = "User not Found"
          redirect_to root_path
          return
       end
       if (Company.exists?(@user.company_id))
          @company = Company.find(@user.company_id);
       else
          flash[:error] = "Company not Found"
          redirect_to root_path
          return
       end
       if (Drawing.exists?(params[:id]))
          @drawing = Drawing.find(params[:id]);
       else
          flash[:error] = "Drawing not Found"
          redirect_to root_path
          return
       end
       @divisions = @user.divisions
       @divs = (@divisions).to_a
       @divcount = @divs.length
       render 'editdrawingdetails'
  end

  def updatedrawingdetails
      session.delete(:return_to)
      session[:return_to] ||= request.referer
      logger.fatal "Params Inspect updatedrawingdetails #{params.inspect}"
      if (User.exists?(params[:user_id]))
         @user = User.find(params[:user_id]);
      else
         flash[:error] = "User not Found"
         redirect_to root_path
         return
      end
      if (Company.exists?(@user.company_id))
         @company = Company.find(@user.company_id);
      else
         flash[:error] = "Company not Found"
         redirect_to root_path
         return
      end
      if (Drawing.exists?(params[:id]))
         @drawing = Drawing.find(params[:id]);
      else
         flash[:error] = "Drawing not Found"
         redirect_to root_path
         return
      end
      priv_level = params[:drawing][:privacy]
      @drawing.privacy     = Drawing.privacies[priv_level]
      @drawing.opportunity = params[:drawing][:opportunity]
      @drawing.customer    = params[:drawing][:customer]
      @drawing.description    = params[:drawing][:description]
      if @drawing.privacy == "division"
         @drawing.division_id = params[:drawing][:division]
      else
         @drawing.division_id = 0
      end
      if @drawing.update_attributes(drawing_params)
        flash[:notice] = "Edit Saved"
        redirect_to edit_company_user_drawing_path(@company.id, @user.id, @drawing.id)
        return
      else
        render 'editdrawingdetails'
      end

  end

  def create
    logger.fatal "In Drawing#create"
    logger.fatal "Params #{params.inspect}"
    @drawing = Drawing.new
    @drawing.customer = params[:customer]
    @drawing.description = params[:description]
    @drawing.user_id = params[:user_id]
    @drawing.company_id = params[:company_id]
    @drawing.opportunity = params[:opportunity]
    @drawing.division_id = params[:division_id]
    @drawing.privacy = params[:privacy]
    @drawing.drawing = ""
    @drawing.png = ""
    logger.fatal "Drawing Object in drawings_controller create #{@drawing.inspect}"
    if @drawing.save
      # Handle a successful update.
      flash[:notice] = "New Drawing Saved"
      redirect_to edit_company_user_drawing_path(params[:company_id], params[:user_id], @drawing.id)
      return
     else
       flash[:notice] = "Drawing Could Not Be Added"
       redirect_to company_user_path(params[:company_id], params[:user_id])
     end
  end

  def update
    logger.fatal "Drawing Vals: #{params.inspect}"
    if (Drawing.exists?(params[:id]))
       @drawing = Drawing.find(params[:id]);
    else
       flash[:error] = "Drawing not Found"
       redirect_to root_path
       return
    end
    @drawing.drawing = params[:drawing].to_json
    @drawing.png     = params[:png]
    logger.fatal "Drawing Vals: #{@drawing.drawing}"
    logger.fatal "Drawing png: #{@drawing.png}"
    if @drawing.save
         render :json => [ @drawing ].to_json
         return
    else
         render :json => [{ :error => "An error was encountered while processing your photos. Please try again." }], :status => 304
    end
  end

  def displayimage
    if (Drawing.exists?(params[:id]))
       @drawing = Drawing.find(params[:id]);
       @png = @drawing.png
    else
       flash[:error] = "Drawing not Found"
       redirect_to root_path
       return
    end
  end

  def getimage
     logger.fatal "Looking at drawing #{params[:id]}"
     if (Drawing.exists?(params[:id]))
        drawing = Drawing.find(params[:id]);
     else
        flash[:error] = "Drawing not Found"
        redirect_to root_path
        return
     end
     logger.fatal "#{drawing.inspect}"
     logger.fatal "Looking at png #{drawing.png}"
     justpngdata = drawing.png.slice(drawing.png.index(",")+1..-1)
     logger.fatal "Made it past justpngdata"
     decodedImage = Base64.decode64(justpngdata)
     logger.fatal "decoded Image"
     send_data decodedImage, :type => 'image/png',:disposition => 'inline'
  end

  def show_image
      if (Drawing.exists?(params[:id]))
         drawing = Drawing.find(params[:id]);
      else
         flash[:error] = "Drawing not Found"
         redirect_to root_path
         return
      end
      @png = drawing.png
      @companyid = params[:company_id]
      @userid = params[:user_id]
      @drawingid = params[:id]
      @viewpng = true
  end

  def send_image_form
      logger.fatal "Inspect Params"
      logger.fatal "#{params.inspect}"
      session.delete(:return_to)
      session[:return_to] ||= request.referer
      logger.fatal "In Send Image Form"
      logger.fatal "#{session.inspect}"
      @message = MessageImage.new
      @message.company_id = params[:company_id]
      @message.user_id = params[:user_id]
      @message.drawing_id = params[:id]
  end

  def send_image
    logger.fatal "Inspect Params"
    logger.fatal "#{params.inspect}"
    #if params[:commit].to_s == "Send"
       @message = MessageImage.new
       @message.company_id = params[:company_id]
       @message.user_id = params[:user_id]
       @message.drawing_id = params[:id]
       @message.email1 = params[:message_image][:email1]
       @message.email2 = params[:message_image][:email2]
       @message.email3 = params[:message_image][:email3]
       @message.email4 = params[:message_image][:email4]
       @message.content = params[:message_image][:content]
       logger.fatal "Inspect Message"
       logger.fatal "#{@message.inspect}"
       if @message.valid?
         MessageImageMailer.new_message(@message).deliver
         redirect_to company_user_path(session[:company_id] ,session[:user_id]), notice: "Your messages has been sent."
       else
         flash[:alert] = "An error occurred while delivering this message."
         redirect_to company_user_path(session[:company_id] ,session[:user_id])
       end
    #else
    #   redirect_to company_user_path(session[:company_id] ,session[:user_id])
    #end
  end

  private

    def addErrorsToFlash(errors)
      errors.each do |key, val|
        flash[key] = val;
      end
    end

    def drawing_params
      params.permit(:customer, :opportunity, :description, :company_id, :division_id, :privacy, :png, :user_id, :id)
    end

    def check_for_cancel
      session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
      if params[:button] == "Cancel"
        redirect_to session.delete(:return_to)
      end
    end

    def resolve_layout
       case action_name
          when "displayimage"
             "nolayout"
          when "edit"
             "editlayout"
          else
             "application"
          end
      end
   end
