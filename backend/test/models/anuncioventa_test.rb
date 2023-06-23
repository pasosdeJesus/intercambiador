require "test_helper"

class AnuncioventaTest < ActiveSupport::TestCase

  test "valido" do
    usuario = Usuario.create PRUEBA_USUARIO
    assert usuario.valid?
    pesoporton = ::Pesoporton.create(PRUEBA_PESOPORTON)
    assert(pesoporton.valid?)
    anuncioventa = Anuncioventa.new PRUEBA_ANUNCIO
    anuncioventa.usuario_id = usuario.id
    anuncioventa.ultimopesoporton_id = pesoporton.id
    assert anuncioventa.valid?
    anuncioventa.save
    anuncioventa.destroy
    pesoporton.destroy
    usuario.destroy
  end

  test "no valido" do
    anuncioventa = Anuncioventa.new PRUEBA_ANUNCIO
    assert_not anuncioventa.valid?
    anuncioventa.destroy
  end

end
