class Company < ActiveRecord::Base
    has_many :users, :dependent => :restrict_with_error
    has_many :divisions, :dependent => :restrict_with_error
    has_many :prices, :dependent => :restrict_with_error
    validates :name, presence: true, uniqueness: true, :case_sensitive => false
    validates :licenses, presence: true, numericality: { only_integer: true, :greater_than_or_equal_to => 0  }

    def additionalUserLicensed
        flashval = {}
        val = false;
        if (self.users.size < self.licenses)
           val = true;
        else
           flashval[:error_license] = "Cannot Add User:  All Licenses Have Been Used"
        end
        return [val, flashval];
    end

end
