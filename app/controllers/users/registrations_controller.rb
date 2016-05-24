class Users::RegistrationsController < Devise::RegistrationsController
# before_action :configure_sign_up_params, only: [:create]
# before_action :configure_account_update_params, only: [:update]
prepend_before_filter :require_no_authentication, :only => [ :cancel ]

  # GET /resource/sign_up
  def new
    flash[:info] = 'Registrations are not open.'
    redirect_to root_path
  end

  # POST /resource
  def create
    puts "Sign up params: #{sign_up_params.inspect}"
    logger.debug "Sign up params: #{sign_up_params.inspect}"
    puts "Password: #{sign_up_params[:password]}"
    build_resource(sign_up_params)
    resource.password = sign_up_params[:email]
    resource.password_confirmation = sign_up_params[:email]
    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      flash[:error] = resource.errors.full_messages.to_sentence
      @company = Company.find(current_user.company_id)
      respond_with @company
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :provider, :role, :company_id, :timezone])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update,keys: [:username, :provider, :role, :company_id, :timezone])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  def after_sign_up_path_for(resource)
     company_path(current_user.company_id )
  end
  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
  def after_inactive_sign_up_path_for(resource)
    company_path(current_user.company_id )
  end

  def after_update_path_for(resource)
        company_user_path(current_user.company_id, current_user.id )
  end
end
