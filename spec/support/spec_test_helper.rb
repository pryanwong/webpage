# spec/support/spec_test_helper.rb
module SpecTestHelper

  def login(user_name)
    user = User.where(:email => user_name).first
    request.session[:user_id] = user.id
    request.session[:company_id] = user.company_id
    request.session[:role] = user.role
    request.session[:email] = user.email
    request.session[:company_id] = user.company_id
  end

  #def login(user_double)
  #  request.session[:user_id] = user_double.id
  #  request.session[:company_id] = user_double.company_id
  #end

  def current_user
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
  end

  def current_ability
    #User.find(request.session[:user_id])
    puts "current_user: #{current_user}"
    puts "#{Ability.new(current_user)}"
    Ability.new(current_user)
  end
end
