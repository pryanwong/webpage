require 'csv'

class DrawingsController < ApplicationController
  respond_to :json, :html
  load_and_authorize_resource :drawing
  #before_filter :check_for_cancel, :only => [:updatedrawingdetails, :send_image, :send_image_form]
  layout :resolve_layout

  def edit
       logger.info "Entering DrawingsController:edit"
       @drawing = Drawing.new
       if (Drawing.exists?(params[:id]))
          logger.debug "Drawing exists: #{params[:id]}"
          @drawing = Drawing.find(params[:id]);
       else
          logger.error "Drawing not Found"
          flash[:error] = "Drawing not Found"
          redirect_to root_path
          return
       end
       @editdetails = true;
       if @drawing.drawing == nil || @drawing.drawing.length == 0
          logger.error "No drawing found"
          @drawing.drawing = "{}"
       end
       company = Drawing.new
       if (Company.exists?(params[:company_id]))
          logger.debug "Company exists: #{params[:company_id]}"
          company = Company.find(params[:company_id]);
       else
          logger.error "No Company found"
          flash[:error] = "Company not Found"
          redirect_to root_path
          return
       end

       #Aws.config.update({
       #   region: ENV['s3_region'],
       #   credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY']),
       # })

       # S3_BUCKET = Aws::S3::Resource.new.bucket(ENV['S3_BUCKET_NAME'])

       creds = Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
       s3 = Aws::S3::Resource.new(region: ENV['s3_region'], credentials: creds)
       logger.debug "s3.inspect"
       logger.debug "#{s3.inspect}"
       obj = s3.bucket(ENV['S3_BUCKET_NAME']).object("system/#{@drawing.company_id}/#{@drawing.id}/#{SecureRandom.uuid}/${filename}")
       logger.debug "obj.inspect"
       logger.debug "#{obj.inspect}"
       logger.debug "#{obj.methods}"
       options = { acl: 'public-read',
                success_action_status: '201',
                acl: 'public-read'}
       @presigned_post = obj.presigned_post(options)
       @public_url = obj.public_url
       logger.debug "presigned_post.inspect"
       logger.debug "#{@presigned_post.inspect}"
       logger.debug "public_url.inspect"
       logger.debug "#{@public_url.inspect}"

       logger.info "Leaving DrawingsController:edit"
       logger.info "Rendering #{company.portal}"
       render "drawings/portals/#{company.portal}"
  end


  def editdrawingdetails
       logger.info "Entering DrawingsController:editdrawingdetails"
       if (User.exists?(params[:user_id]))
          logger.debug "User exists: #{params[:user_id]}"
          @user = User.find(params[:user_id]);
       else
          logger.debug "User not Found"
          flash[:error] = "User not Found"
          redirect_to root_path
          return
       end
       if (Company.exists?(@user.company_id))
          logger.debug "Company exists: #{@user.company_id}"
          @company = Company.find(@user.company_id);
       else
          logger.error "Company not Found"
          flash[:error] = "Company not Found"
          redirect_to root_path
          return
       end
       if (Drawing.exists?(params[:id]))
          logger.debug "Drawing exists: #{params[:id]}"
          @drawing = Drawing.find(params[:id]);
       else
          logger.error "Drawing not Found"
          flash[:error] = "Drawing not Found"
          redirect_to root_path
          return
       end
       @divisions = @user.divisions
       @divs = (@divisions).to_a
       @divcount = @divs.length
       logger.info "Leaving DrawingsController:editdrawingdetails"
       render 'editdrawingdetails'
  end

  def updatedrawingdetails
      logger.info "Entering DrawingsController:updatedrawingdetails"
      session.delete(:return_to)
      session[:return_to] ||= request.referer
      logger.fatal "Params Inspect updatedrawingdetails #{params.inspect}"
      if (User.exists?(params[:user_id]))
         logger.debug "User exists: #{params[:user_id]}"
         @user = User.find(params[:user_id]);
      else
         logger.error "User not Found: #{params[:user_id]}"
         flash[:error] = "User not Found"
         redirect_to root_path
         return
      end
      if (Company.exists?(@user.company_id))
         logger.debug "Company exists: #{@user.company_id}"
         @company = Company.find(@user.company_id);
      else
         logger.error "Company not Found: #{@user.company_id}"
         flash[:error] = "Company not Found"
         redirect_to root_path
         return
      end
      if (Drawing.exists?(params[:id]))
         logger.debug "Drawing exists: #{params[:id]}"
         @drawing = Drawing.find(params[:id]);
      else
         logger.error "Drawing not Found: #{params[:id]}"
         flash[:error] = "Drawing not Found"
         redirect_to root_path
         return
      end
      logger.debug "Parameters:  #{params.inspect}"
      priv_level = params[:drawing][:privacy]
      @drawing.privacy     = Drawing.privacies[priv_level]
      @drawing.opportunity = params[:drawing][:opportunity]
      @drawing.customer    = params[:drawing][:customer]
      @drawing.description    = params[:drawing][:description]
      if @drawing.privacy == "division"
         logger.debug "drawing.privacy == division"
         @drawing.division_id = params[:drawing][:division]
      else
         logger.debug "drawing.privacy == 0"
         @drawing.division_id = 0
      end
      if @drawing.update_attributes(drawing_params)
        flash[:notice] = "Edit Saved"
        logger.debug "Edit Saved"
        logger.info "Leaving DrawingsController:updatedrawingdetails"
        redirect_to company_user_path(@company.id, @user.id)
        return
      else
        logger.info "Leaving DrawingsController:updatedrawingdetails"
        render 'editdrawingdetails'
      end

  end

  def bom
    logger.info "Entering DrawingsController:bom"
    logger.debug "Params:  #{params.inspect}"
    @company_id = params[:company_id]
    @drawing = Drawing.new
    if (User.exists?(params[:user_id]))
       logger.debug "User Exists:  #{params[:user_id]}"
       @user = User.find(params[:user_id]);
    else
       logger.error "User not Found:  #{params[:user_id]}"
       flash[:error] = "User not Found"
       logger.info "Leaving DrawingsController:bom"
       redirect_to root_path
       return
    end
    if (Drawing.exists?(params[:id]))
       logger.debug "Drawing Exists:  #{params[:id]}"
       @drawing = Drawing.find(params[:id]);
    else
       logger.error "Drawing not Found:  #{params[:id]}"
       flash[:error] = "Drawing not Found"
       logger.info "Leaving DrawingsController:bom"
       redirect_to root_path
    end
    if (@drawing.drawing == "")
       logger.debug "No drawing made yet"
       flash[:error] = "No drawing made yet"
       logger.info "Leaving DrawingsController:bom"
       redirect_to company_user_path(@company_id, @user.id)
    else
      logger.debug "Counting Objects"
      obj = JSON.parse(@drawing.drawing)
      allObjects = obj["objects"]
      valhash = Hash.new
      modelHash = Hash.new
      configHash = Hash.new
      allObjects.each_with_index { |val, index|
        logger.debug "#{val} : #{index}"
        if (val["type"] == "custom-image")
		       if ( valhash.has_key?(val["model"]))
              logger.debug "valhash has key: #{val["model"]}"
		          modelHash = valhash[val["model"]]
	         else
		          modelHash = Hash.new
	         end
		       if (modelHash.has_key?(val["config"]))
             logger.debug "modelHash has key: #{val["config"]}"
		         configHash = modelHash[val["config"]];
		         configHash[:qty] = configHash[:qty] + 1;
		       else
		         configHash = {:qty => 1, :price => val["price"]}
		       end
		       modelHash[val["config"]] = configHash;
		       valhash[val["model"]] = modelHash;
		    end
     }
     @valsArray = []
     counter = 0;
     valhash.each do |keyv, modelhash|
        modelhash.each do |keym, confighash|
           #valsArray[counter] = Array[confighash[:qty], keyv, keym, confighash[:price]]
           h = {:qty    =>confighash[:qty],
                :model  => keyv,
                :config => keym,
                :price  => confighash[:price]
              }
           @valsArray[counter] = h;
	         counter = counter+1;
        end
     end
     respond_to do |format|
        format.csv { send_data export_csv(@valsArray) }
        format.html
     end
   end
   logger.info "Leaving DrawingsController:bom"
  end

  def create
    logger.info "Entering Drawing#create"
    logger.error "Params #{params.inspect}"
    @drawing = Drawing.new
    @drawing.customer = params[:customer]
    @drawing.description = params[:description]
    @drawing.user_id = params[:user_id]
    @drawing.company_id = params[:company_id]
    @drawing.opportunity = params[:opportunity]
    @drawing.division_id = params[:division_id]
    @drawing.privacy = params[:privacy]
    @drawing.drawing = ""
    logger.debug "Drawing Object in drawings_controller create #{@drawing.inspect}"
    if @drawing.save
      # Handle a successful update.
      logger.debug "New Drawing Saved"
      flash[:notice] = "New Drawing Saved"
      redirect_to edit_company_user_drawing_path(params[:company_id], params[:user_id], @drawing.id)
      logger.info "Leaving Drawing#create"
      return
     else
       logger.error "New Drawing Saved"
       flash[:notice] = "Drawing Could Not Be Added"
       redirect_to company_user_path(params[:company_id], params[:user_id])
       logger.info "Leaving Drawing#create"
     end
     logger.info "Leaving Drawing#create"
  end

  def update
    logger.info "Entering Drawing#update"
    logger.debug "Update Params: #{params.inspect}"
    if (Drawing.exists?(params[:id]))
       logger.debug "Drawing Exists: #{params[:id]}"
       @drawing = Drawing.find(params[:id]);
    else
       logger.error "Drawing not Found: #{params[:id]}"
       flash[:error] = "Drawing not Found"
       redirect_to root_path
       return
    end
    @drawing.drawing = params[:drawing].to_json
    logger.debug "Drawing Vals: #{@drawing.drawing}"
    if @drawing.save
         render :json => [ @drawing ].to_json
         return
    else
         logger.error "An error was encountered while processing your photos. Please try again."
         render :json => [{ :error => "An error was encountered while processing your photos. Please try again." }], :status => 304
    end
    logger.info "Leaving Drawing#update"
  end

  def updateBackground

    logger.info "Entering Drawing#updateBackground"
    logger.fatal "Params: #{params.inspect}"
    logger.info "Leaving Drawing#updateBackground"
  end

  def deleteBackground
    logger.info "Entering Drawing#deleteBackground"
    logger.info "Leaving Drawing#deleteBackground"
  end

  def show_image
      logger.info "Entering Drawing#show_image"
      if (Drawing.exists?(params[:id]))
         logger.debug "Drawing exists: #{params[:id]}"
         drawing = Drawing.find(params[:id]);
      else
         logger.debug "Drawing not Found: #{params[:id]}"
         flash[:error] = "Drawing not Found"
         redirect_to root_path
         return
      end
      if (drawing.drawing == "")
        logger.debug "drawing.drawing not found"
        @png = "none"
      else
        logger.debug "drawing.drawing found"
        @png = drawing.drawing
      end
      @companyid = params[:company_id]
      @userid = params[:user_id]
      @drawingid = params[:id]
      @viewpng = true
      logger.info "Leaving Drawing#show_image"
  end

  def send_image_form
      logger.info "Entering Drawing#send_image_form"
      logger.debug "Inspect Params"
      logger.debug "#{params.inspect}"
      session.delete(:return_to)
      session[:return_to] ||= request.referer
      logger.debug "In Send Image Form"
      logger.debug "#{session.inspect}"
      @drawing = "";
      if (Drawing.exists?(params[:id]))
         logger.debug "Drawing exists: #{params[:id]}"
         drawing = Drawing.find(params[:id]);
      else
         logger.debug "Drawing not Found: #{params[:id]}"
         flash[:error] = "Drawing not Found"
         redirect_to root_path
         return
      end
      if (drawing.drawing == "")
        logger.debug "drawing.drawing not found"
        flash[:error] = "Drawing not Found"
        redirect_to root_path
        return
      else
        logger.debug "drawing.drawing found"
        @drawing = drawing
      end
      @message = MessageImage.new
      @message.company_id = params[:company_id]
      @message.user_id = params[:user_id]
      @message.drawing_id = params[:id]
      logger.info "Leaving Drawing#send_image_form"
  end

  def send_image
       logger.info "Entering Drawing#send_image"
       logger.debug "Inspect Params"
       logger.debug "#{params.inspect}"

       @message = MessageImage.new
       @message.company_id = params[:company_id]
       @message.user_id = params[:user_id]
       @message.drawing_id = params[:id]
       @message.email1 = params[:message_image][:email1]
       @message.email2 = params[:message_image][:email2]
       @message.email3 = params[:message_image][:email3]
       @message.email4 = params[:message_image][:email4]
       @message.content = params[:message_image][:content]
       @message.imageData = params[:message_image][:imageData]
       @message.from = current_user.email
       logger.debug "Inspect Message"
       logger.debug "#{@message.inspect}"
       if @message.valid?
         MessageImageMailer.new_message(@message).deliver
         redirect_to company_user_path(session[:company_id] ,session[:user_id]), notice: "Your messages has been sent."
       else
         logger.debug "An error occurred while delivering this message."
         flash[:alert] = "An error occurred while delivering this message."
         redirect_to company_user_path(session[:company_id] ,session[:user_id])
       end
       logger.info "Leaving Drawing#send_image"
  end

  private

    def addErrorsToFlash(errors)
      logger.info "Entering Drawing#addErrorsToFlash"
      errors.each do |key, val|
        logger.debug "#{key} : #{val}"
        flash[key] = val;
      end
      logger.info "Leaving Drawing#addErrorsToFlash"
    end

    def drawing_params
      params.permit(:customer, :imageData, :opportunity, :description, :company_id, :division_id, :privacy, :user_id, :id)
    end

    #def check_for_cancel
    #  session[:return_to] ||= company_user_path(session[:company_id] ,session[:user_id])
    #  if params[:button] == "Cancel"
    #    redirect_to session.delete(:return_to)
    #  end
    #end


    def resolve_layout
       case action_name
          when "edit"
             "editlayout"
          when "show_image"
              "application_png"
          else
             "application"
          end
       end
    end

    def export_csv(records, options = {})
      CSV.generate(options) do |csv|
        csv << ["Quantity", "Model", "Configuration", "Unit Price"]
        records.each do |record|
          csv << record.values
        end
      end
    end
