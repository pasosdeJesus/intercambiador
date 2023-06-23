class Metododepago < ActiveRecord::Base
  include Msip::Basica

  has_many :anuncioventa_metododepago
end
