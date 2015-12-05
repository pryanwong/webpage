# spec/support/spec_test_helper.rb
module SpecTestHelper

  def login(user_name)
    user = User.where(:email => user_name).first
    request.session[:user_id] = user.id
    request.session[:company_id] = user.company_id
  end

  #def login(user_double)
  #  request.session[:user_id] = user_double.id
  #  request.session[:company_id] = user_double.company_id
  #end

  def current_user
    User.find(request.session[:user_id])
  end

  def current_ability
    User.find(request.session[:user_id])
  end
end
