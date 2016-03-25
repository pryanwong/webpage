class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # authenticate_user uses Devise and Omniauth gems
  #before_action :authenticate_user!
  helper_method :current_user

  def current_user
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def current_ability
     @current_ability ||= Ability.new(current_user)
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
