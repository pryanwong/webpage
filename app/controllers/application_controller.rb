class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # authenticate_user uses Devise and Omniauth gems
  #before_action :authenticate_user!
  helper_method :current_user

  def current_user
     logger.info "Entering ApplicationController:current_user"
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
     logger.debug "current_user #{@current_user.inspect}"
     logger.info "Leaving ApplicationController:current_user"
  end

  def current_ability
     logger.info "Entering ApplicationController:current_ability"
     @current_ability ||= Ability.new(current_user)
     logger.debug "current_ability #{@current_ability.inspect}"
     logger.info "Leaving ApplicationController:current_ability"
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
