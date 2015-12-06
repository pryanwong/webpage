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
  validates_presence_of :company
  validates :role, presence: true, inclusion: { in: User.roles.keys }
  validate :validate_license_available, :only => :new

  def validate_license_available
     if Company.exists?(self.company_id)
        company = Company.find(self.company_id)
        count = User.where(:company_id => self.company_id).count
        if (count >= company.licenses)
            errors.add(:licenses, "Insufficient Licenses to Add a User")
        end
     end
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
