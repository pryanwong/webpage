class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # authenticate_user uses Devise and Omniauth gems
  #before_action :authenticate_user!

  def current_ability
     logger.info "Entering ApplicationController:current_ability"
     @current_ability ||= Ability.new(current_user)
     logger.info "Leaving ApplicationController:current_ability"
     @current_ability
  end

  def after_sign_in_path_for(resource)
     company_user_path(current_user.company_id ,current_user.id)
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
end
