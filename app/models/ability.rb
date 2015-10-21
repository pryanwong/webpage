class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
       user ||= User.new # guest user (not logged in)
       if (!user.role_id.nil?)
            user.setrole(user.role_id)
       end
       #logger.fatal "User Role #{user.role}"
       #logger.fatal "User Role ID #{user.role_id}"
       if user.role? :moderator
         can :read, Company, :id => user.company_id
         can [:create, :read, :update, :destroy, :removeuserdiv,:newdrawing ,:newdrawingproc], User, :company_id => user.company_id
          can [:switchuser,:switchback], User, :user_id => user.id, :company_id => user.company.id
         can [:create, :read, :update, :destroy ], Division, :company_id => user.company_id
         can [:create], Drawing, :user_id => user.id, :companpy_id => user.company_id
         can [:index, :read, :update, :edit, :new, :editdrawingdetails, :updatedrawingdetails, :show_image, :getimage, :displayimage, :send_image_form, :send_image], Drawing do |drawing|
           (drawing.user_id == user.id || ((UserMembership.where(division: (user.divisions.select{|u| u.share==true}.map{|x| x[:id]}))).map{|y| y[:user_id]}.include? drawing.user_id))
         end
         can [:index,:show,:newdrawing,:newdrawingproc], :user
         #can :manage, :all
       elsif user.role? :admin
         can :manage, :all
       elsif user.role? :user
         can [:index, :read, :update,:edit, :new, :editdrawingdetails, :updatedrawingdetails, :show_image, :getimage, :displayimage, :send_image_form, :send_image], Drawing do |drawing|
           (drawing.user_id == user.id || ((UserMembership.where(division: (user.divisions.select{|u| u.share==true}.map{|x| x[:id]}))).map{|y| y[:user_id]}.include? drawing.user_id))
         end
         can [:switchuser,:switchback], User, :user_id => user.id, :company_id => user.company.id
         can [:create], Drawing, :user_id => user.id, :companpy_id => user.company_id
         can [:show,:newdrawing,:newdrawingproc], User, :id => user.id
       end
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities
  end
end
