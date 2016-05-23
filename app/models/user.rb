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
  #devise :database_authenticatable, :registerable, :omniauthable, :omniauth_providers => [:google_oauth2], :recoverable, :rememberable, :trackable, :validatable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :confirmable, :omniauthable, :lockable, :omniauth_providers => [:google_oauth2, :linkedin]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  #ROLES = {0 => :guest, 1 => :user, 2 => :moderator, 3 => :admin}
  #attr_reader :role
  enum role: [ :guest, :user, :moderator, :admin]
  validates :email, presence: true, email: true
  has_many :user_memberships, :class_name => 'UserMembership', :dependent => :destroy
  has_many :divisions, :through => :user_memberships
  has_many :drawings, :dependent => :restrict_with_error
  belongs_to :company
  validates_presence_of :company, :timezone
  validates :role, presence: true, inclusion: { in: User.roles.keys }
  validates_inclusion_of :provider, :in => %w( linkedin google_oauth2 optecture), presence: true
  validate :validate_license_available, :only => :new
  validate :validate_only_one_email_per_provider_new, :on => :create
  validate :validate_only_one_email_per_provider

  def validate_only_one_email_per_provider_new
    logger.debug "validate_only_one_email_per_provider_new"
    logger.debug "#{self.inspect}"
    logger.debug "#{self.email} , #{self.provider}"
    count = User.where(:email => self.email, :provider => self.provider).count
    logger.debug "count: #{count}"
    if (count > 0)
      errors.add(:licenses, "Duplicate new record, already exists")
    end
  end

  def validate_only_one_email_per_provider
    logger.debug "validate_only_one_email_per_provider"
    logger.debug "#{self.email} , #{self.provider}"
    count = User.where(:email => self.email, :provider => self.provider).where.not(id: self.id).count
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

  #def self.from_omniauth(auth, remote_ip)
  #    logger.debug "In User from_omniauth"
  #    logger.debug "#{auth}"
  #    if (auth.info.email).blank?
  #      user = nil
  #    else
  #       if User.exists?(:email => auth.info.email, :provider => User.providers[auth.provider])
  #          user = User.where(email: auth.info.email, provider: User.providers[auth.provider]).first
  #          user.uid                    = auth.uid
  #          user.reset_password_token   = auth.credentials.token
  #          user.reset_password_sent_at = Time.at(auth.credentials.expires_at)
  #          user.last_sign_in_at        = user.current_sign_in_at
  #          user.current_sign_in_at     = Time.new
  #          user.last_sign_in_ip        = user.current_sign_in_ip
  #          user.current_sign_in_ip     = remote_ip
  #          user.save!
  #       end
  #    end
  #    user
  #end

  def self.from_omniauth(auth)
    logger.debug "From Omniauth: #{auth.inspect}"
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.name = auth.info.name   # assuming the user model has a name
      user.image = auth.info.image # assuming the user model has an image
    end
  end

  def self.new_with_session(params, session)
    logger.debug "From new_with_session: #{session.inspect}"
    super.tap do |user|
      if data = session["devise.google_oauth2_data"] && session["devise.google_oauth2_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

end
