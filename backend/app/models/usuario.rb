
require "msip/concerns/models/usuario"
class Usuario < ActiveRecord::Base
  include Msip::Concerns::Models::Usuario

  validates :direccion, uniqueness: true
end
