class Users::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end
  layout 'longpages'

  def create
    user = User.find_by_email(resource_params[:email])
    provider = ""
    if (User.exists?(:email  => resource_params[:email]))
      provider = User.find_by_email(resource_params[:email]).provider
    end
    if provider == 'optecture'
       self.resource = resource_class.send_reset_password_instructions(resource_params)
       yield resource if block_given?
       if successfully_sent?(resource)
         respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
       else
         flash[:error] = resource.errors.full_messages.to_sentence
         respond_with(resource)
       end
    else
       providerval = "Linkedin"
       providerval = "Google" if provider == 'google_oauth2'
       flash[:error] = "No Passwords issued for #{providerval} by Optecture"
       redirect_to new_password_path(resource_name)
    end
  end
  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
       resource.unlock_access! if unlockable?(resource)
       if Devise.sign_in_after_reset_password
         flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
         set_flash_message!(:notice, flash_message)
         sign_in(resource_name, resource)
       else
         set_flash_message!(:notice, :updated_not_active)
       end
       respond_with resource, location: after_resetting_password_path_for(resource)
    else
       set_minimum_password_length
       flash[:error] = resource.errors.full_messages.to_sentence
       respond_with resource
    end
  end

  protected

  def after_resetting_password_path_for(resource)
     company_user_path(current_user.company_id ,current_user.id)
  end

  # The path used after sending reset password instructions
  def after_sending_reset_password_instructions_path_for(resource_name)
     root_path
  end
end
