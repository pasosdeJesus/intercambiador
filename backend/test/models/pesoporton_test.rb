require 'test_helper'

class PesoportonTest < ActiveSupport::TestCase

  test "valido" do
    pesoporton = ::Pesoporton.create(
      PRUEBA_PESOPORTON)
    assert(pesoporton.valid?)
    pesoporton.destroy
  end

  test "no valido" do
    pesoporton = ::Pesoporton.new(PRUEBA_PESOPORTON)
    pesoporton.valor = nil
    assert_not(pesoporton.valid?)
    pesoporton.destroy
  end

  test "existente" do
    skip
    pesoporton = ::Pesoporton.where(id: 0).take
    assert_equal(pesoporton.nombre, "SIN INFORMACIÓN")
  end

end
