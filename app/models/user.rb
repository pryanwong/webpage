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
  enum provider: [ :google_oauth2, :linkedin]
  validates :email, presence: true
  has_many :user_memberships, :class_name => 'UserMembership', :dependent => :destroy
  has_many :divisions, :through => :user_memberships
  has_many :drawings, :dependent => :restrict_with_error
  belongs_to :company
  validates_presence_of :company
  validates :role, presence: true, inclusion: { in: User.roles.keys }
  validates :provider, presence: true, inclusion: { in: User.providers.keys }
  validate :validate_license_available, :only => :new
  validate :validate_only_one_email_per_provider_new, :on => :create
  validate :validate_only_one_email_per_provider

  def validate_only_one_email_per_provider_new
    logger.debug "validate_only_one_email_per_provider_new"
    logger.debug "#{self.email} , #{self.provider}"
    count = User.where(:email => self.email, :provider => User.providers[self.provider]).count
    logger.debug "count: #{count}"
    if (count > 0)
      errors.add(:licenses, "Duplicate new record, already exists")
    end
  end

  def validate_only_one_email_per_provider
    logger.debug "validate_only_one_email_per_provider"
    logger.debug "#{self.email} , #{self.provider}"
    count = User.where(:email => self.email, :provider => User.providers[self.provider]).where.not(id: self.id).count
    logger.debug "count: #{count}"
    if (count > 0)
      errors.add(:licenses, "Duplicate, error in edit, record exists")
    end
  end

  def validate_license_available
     if Company.exists?(self.company_id)
        company = Company.find(self.company_id)
        count = User.where(:company_id => self.company_id).count
        if (count >= company.licenses)
            errors.add(:licenses, "Insufficient Licenses to Add a User")
        end
     end
  end

  def self.from_omniauth(auth, remote_ip)
      logger.debug "In User from_omniauth"
      logger.debug "#{auth}"
      if (auth.info.email).blank?
        user = nil
      else
         if User.exists?(:email => auth.info.email, :provider => User.providers[auth.provider])
            user = User.where(email: auth.info.email, provider: User.providers[auth.provider]).first
            user.uid                    = auth.uid
            user.reset_password_token   = auth.credentials.token
            user.reset_password_sent_at = Time.at(auth.credentials.expires_at)
            user.last_sign_in_at        = user.current_sign_in_at
            user.current_sign_in_at     = Time.new
            user.last_sign_in_ip        = user.current_sign_in_ip
            user.current_sign_in_ip     = remote_ip
            #user.setrole(user.role_id)
            user.save!
         end
      end
      user
  end

end
