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
      errors.add(:licenses, t('activerecord.user.duplicate'))
    end
  end

  def validate_only_one_email_per_provider
    logger.debug "validate_only_one_email_per_provider"
    logger.debug "#{self.email} , #{self.provider}"
    count = User.where(:email => self.email, :provider => self.provider).where.not(id: self.id).count
    logger.debug "count: #{count}"
    if (count > 0)
      errors.add(:licenses, t('activerecord.user.duplicate'))
    end
  end

  def validate_license_available
     if Company.exists?(self.company_id)
        company = Company.find(self.company_id)
        count = User.where(:company_id => self.company_id).count
        if (count >= company.licenses)
            errors.add(:licenses, t('activerecord.user.insufficient_licenses'))
        end
     end
  end

  def self.from_omniauth(auth , remote_ip)
    logger.debug "From Omniauth: #{auth.inspect}"
    user = nil
    if where(provider: auth.provider, email: auth.info.email).count == 0
      raise ActiveRecord::RecordNotFound
    else
      user = User.where(email: auth.info.email, provider: auth.provider).first
      user.last_sign_in_ip        = user.current_sign_in_ip
      user.current_sign_in_ip     = remote_ip
      user.save
    end
    user
  end

  def self.new_with_session(params, session)
    logger.debug "From new_with_session: #{session.inspect}"
    super.tap do |user|
      if data = session["devise.google_oauth2_data"] && session["devise.google_oauth2_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  def active_for_authentication?
     super && (self.suspended == false)
  end

  def inactive_message
     if self.suspended == true
        "suspended"
     else
       super
     end
  end

end
