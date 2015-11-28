class Company < ActiveRecord::Base
    has_many :users
    has_many :divisions
    validates :name, presence: true, uniqueness: true
    validates :licenses, presence: true

    def companyValid(val_id)
      valid_company = false;
      error_messages = {};
      if (!id.blank? && !(id == nil))
         if Company.exists?(id: val_id)
            valid_company = true;
         else
            error_messages[:error_company_not_found] = "Company Not Found"
         end
      else
         error_messages[:error_company_id] = "Company Id not Provided"
      end
      return [val_id, error_messages];
    end

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
