
require "msip/concerns/models/usuario"
class Usuario < ActiveRecord::Base
  include Msip::Concerns::Models::Usuario
end
