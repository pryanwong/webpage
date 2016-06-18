class Users::ConfirmationsController < Devise::ConfirmationsController
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end
  layout 'longpages2'

  def new
     super
  end

  def create
    logger.debug "Resource Params Confirmations: #{resource_params.inspect}"
    self.resource = resource_class.send_confirmation_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      # respond_with({}, location: after_resending_confirmation_instructions_path_for(resource_name))
      flash[:notice] = "Confirmation Email Successfully Resent"
      redirect_to root_path
    else
      flash[:error] = resource.errors.full_messages.to_sentence
      redirect_to root_path
    end
  end
  # GET /resource/confirmation?confirmation_token=abcdef
  # def show
  #   super
  # end

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end
  def after_confirmation_path_for(resource_name, resource)
      if signed_in?(resource_name)
        signed_in_root_path(resource)
      else
        root_path
      end
    end
end
