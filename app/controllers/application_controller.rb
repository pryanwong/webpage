class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # authenticate_user uses Devise and Omniauth gems
  #before_action :authenticate_user!

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_filter :set_locale

  def set_locale
    val = extract_locale_from_accept_language_header
    puts val
    I18n.locale = val
  end

  def current_ability
     logger.info "Entering ApplicationController:current_ability"
     @current_ability ||= Ability.new(current_user)
     logger.info "Leaving ApplicationController:current_ability"
     @current_ability
  end

  def after_sign_in_path_for(resource)
    if current_user.sign_in_count == 1 && current_user.provider == "optecture"
       edit_user_registration_path
    else
       company_user_path(current_user.company_id ,current_user.id)
     end
  end

  def remote_ip
    if request.remote_ip == '127.0.0.1'
      # Hard coded remote address
      '123.45.67.89'
    else
      request.remote_ip
    end
  end

  rescue_from  ActiveRecord::RecordNotFound do |exception|
    respond_to do |format|
      format.html {
         flash[:notice] = exception.message
         redirect_to recordnotfound_path
      }
      format.json {
         render :text => '{"error": "Data Not Found"}'
      }
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    flash[:notice] = exception.message
    redirect_to accessdenied_path
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :provider, :role, :company_id, :timezone])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :provider, :role, :company_id, :timezone])
  end

  def extract_locale_from_accept_language_header
  case request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first
    when 'en'
      'en'
    when 'fr'
      'fr'
    else
      'en'
  end
end

end
