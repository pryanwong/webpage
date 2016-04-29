class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # authenticate_user uses Devise and Omniauth gems
  #before_action :authenticate_user!
  helper_method :current_user

  def current_user
     logger.info "Entering ApplicationController:current_user"
     logger.debug "Session user_id: #{session[:user_id]}"
     @current_user ="";
     if (session[:user_id])
         @current_user = User.new
         @current_user.id = session[:user_id]
         @current_user.role = session[:role]
         @current_user.email = session[:email]
         @current_user.company_id = session[:company_id]
     else
         @current_user = false;
     end
     logger.debug "Current User: #{@current_user.inspect}"
     logger.info "Leaving ApplicationController:current_user"
     @current_user
  end

  def current_ability
     logger.info "Entering ApplicationController:current_ability"
     @current_ability ||= Ability.new(current_user)
     logger.info "Leaving ApplicationController:current_ability"
     @current_ability
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
