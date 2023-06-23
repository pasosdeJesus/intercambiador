require 'test_helper'

class MetododepagoTest < ActiveSupport::TestCase

  PRUEBA_METODODEPAGO = {
    nombre: "Metododepago",
    fechacreacion: "2023-05-12",
    created_at: "2023-05-12"
  }

  test "valido" do
    metododepago = ::Metododepago.create(
      PRUEBA_METODODEPAGO)
    assert(metododepago.valid?)
    metododepago.destroy
  end

  test "no valido" do
    metododepago = ::Metododepago.new(
      PRUEBA_METODODEPAGO)
    metododepago.nombre = ''
    assert_not(metododepago.valid?)
    metododepago.destroy
  end

  test "existente" do
    skip
    metododepago = ::Metododepago.where(id: 0).take
    assert_equal(metododepago.nombre, "SIN INFORMACIÓN")
  end

end
