require "test_helper"

class AnuncioTest < ActiveSupport::TestCase

  test "valido" do
    usuario = Usuario.create PRUEBA_USUARIO
    assert usuario.valid?
    anuncio = Anuncio.new PRUEBA_ANUNCIO
    anuncio.usuario_id = usuario.id
    anuncio.save
    assert anuncio.valid?
    anuncio.destroy
    usuario.destroy
  end

  test "no valido" do
    anuncio = Anuncio.new PRUEBA_ANUNCIO
    assert_not anuncio.valid?
    anuncio.destroy
  end

end
