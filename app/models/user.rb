class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  ROLES = {0 => :guest, 1 => :user, 2 => :moderator, 3 => :admin}

  attr_reader :role
  validates :email, presence: true
  has_many :user_memberships, :class_name => 'UserMembership'
  has_many :divisions, :through => :user_memberships
  has_many :drawings
  belongs_to :company

  def new

  end

  def after_initialize(role_id = 0)
    @role = ROLES.has_key?(role_id.to_i) ? ROLES[role_id.to_i] : ROLES[0]
  end

  def setrole(role_id = 0)
    @role = ROLES.has_key?(role_id.to_i) ? ROLES[role_id.to_i] : ROLES[0]
  end

  def role?(role_name)
    role == role_name
  end

  def self.from_omniauth(auth)
      if User.where(:email => auth.info.email).blank?
        user = nil
      else
        user = User.find_by(email: auth.info.email)
        user.uid = auth.uid
        user.reset_password_token = auth.credentials.token
        user.reset_password_sent_at = Time.at(auth.credentials.expires_at)
        user.setrole(user.role_id)
        user.save!
      end
      user
  end

end
