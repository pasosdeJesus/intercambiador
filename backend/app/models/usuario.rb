
require "msip/concerns/models/usuario"
class Usuario < ActiveRecord::Base
  include Msip::Concerns::Models::Usuario

  validates :direccion, uniqueness: true

  validates :nombrecomercial, length: {maximum: 255}
  validates :referencia_para_pago, length: {maximum: 64}
  validates :nombre_referencia, length: {maximum: 255}
end
