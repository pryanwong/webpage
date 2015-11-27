class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      record.errors[attribute] << (options[:message] || "is not an email")
    end
  end
end

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  #ROLES = {0 => :guest, 1 => :user, 2 => :moderator, 3 => :admin}
  #attr_reader :role
  enum role: [ :guest, :user, :moderator, :admin]
  validates :email, presence: true, uniqueness: true, email: true
  has_many :user_memberships, :class_name => 'UserMembership', :dependent => :destroy
  has_many :divisions, :through => :user_memberships
  has_many :drawings, :dependent => :restrict_with_error
  belongs_to :company
  validates_associated :company
  validates :role, presence: true

  def validateNewUser(params)
      #Determine if User already exists
      user_exists = false;
      email_param = false;
      isadmin_valid = false;
      valid_data = false;
      error_messages = {};

      if (!params[:user][:email].blank?)
         email_param = true;
         if User.exists?(email: params[:user][:email])
            user_exists = true;
            error_messages[:user_exists] = "User already exists"
         end
      else
         error_messages[:email_blank] = "Email not Provided"
      end

      if (!params[:user][:isadmin].blank?)
         if (params[:user][:isadmin].to_i ==1 || params[:user][:isadmin].to_i == 0)
           isadmin_valid = true;
         else
           error_messages[:isadmin] = "Admin Value Not Valid"
         end
      else
        error_messages[:isadmin_blank] = "Is Admin not Provided"
      end
      if (!user_exists & email_param & isadmin_valid)
        valid_data = true;
      end
      return [valid_data, error_messages]
  end

  def validateExistingUser(params)
      #Determine if User already exists
      user_exists = false;
      email_param = false;
      user_id_param = false;
      isadmin_valid = false;
      valid_data = false;
      error_messages = {};

      if (!params[:id].blank?)
         if (User.exists?(id: params[:id]))
            user_exists = true;
         end
      end
      if (!params[:user][:email].blank?)
         email_param = true;
      else
         error_messages[:email_blank] = "Email not Provided"
      end

      if (!params[:user][:isadmin].blank?)
         if (params[:user][:isadmin].to_i ==1 || params[:user][:isadmin].to_i == 0)
           isadmin_valid = true;
         else
           error_messages[:isadmin] = "Admin Value Not Valid"
         end
      else
        error_messages[:isadmin_blank] = "Is Admin not Provided"
      end
      if (user_exists & email_param & isadmin_valid)
        valid_data = true;
      end
      return [valid_data, error_messages]
  end

  def updateUser(params)

      if (!params[:user][:isadmin].blank?)
         if params[:user][:isadmin].to_i == 1
            self.moderator!
            self.isadmin = true;
         else
            self.user!
            self.isadmin = false;
         end
      end

      if (!params[:user][:email].blank?)
         self.email = params[:user][:email]
      end


      successfullyAdded = false;
      userErrors = {}
      successfullyAdded = self.save

      if successfullyAdded
        userErrors[:notice] = "User Has Been Successfully Updated "
      else
        if (!self.errors.empty?)
           self.errors.each do |attr,err|
             userErrors[attr] = err.to_s()
           end
        end
        userErrors[:could_not_update] = "Could Not Update User"
      end
      return [successfullyAdded, userErrors]
  end

  def deleteUser
     successfullyDeleted = self.destroy
     userErrors = {}
     if successfullyDeleted
       userErrors[:notice] = "User Has Been Successfully Deleted "
     else
       if (!self.errors.empty?)
          self.errors.each do |attr,err|
            userErrors[attr] = err.to_s()
          end
       end
       userErrors[:could_not_update] = "Could Not Delete User"
     end
     return [successfullyDeleted, userErrors]
  end

  def addNewUser(params)
      role_val = 1
      if params[:user][:isadmin].to_i == 1
         role_val = User.roles["moderator"]
      else
         role_val = User.roles["user"]
      end
      successfullyAdded = false;
      userErrors = {}
      successfullyAdded = User.create(email: params[:user][:email], role: role_val, isadmin: params[:user][:isadmin], company_id: params[:company_id])
      if successfullyAdded
        userErrors[:notice] = "User Has Been Added Successfully"
      else
        userErrors[:error] = "Could not Add User"
      end
      return [successfullyAdded, userErrors]
  end

  def self.from_omniauth(auth)
      if User.where(:email => auth.info.email).blank?
        user = nil
      else
        user = User.find_by(email: auth.info.email)
        user.uid = auth.uid
        user.reset_password_token = auth.credentials.token
        user.reset_password_sent_at = Time.at(auth.credentials.expires_at)
        #user.setrole(user.role_id)
        user.save!
      end
      user
  end

end
