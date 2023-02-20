require "test_helper"

class AnunciosControllerTest < ActionDispatch::IntegrationTest
  setup do
    debugger
    @anuncio = anuncio()
  end

  test "should get index" do
    debugger
    get anuncios_url, as: :json
    assert_response :success
  end

  test "should create anuncio" do
    debugger
    assert_difference("Anuncio.count") do
      post anuncios_url, params: { anuncio: { limiteinferior: @anuncio.limiteinferior, margenflotante: @anuncio.margenflotante, maximotiempo: @anuncio.maximotiempo, ton: @anuncio.ton, usuario_id: @anuncio.usuario_id } }, as: :json
    end

    assert_response :created
  end

  test "should show anuncio" do
    debugger
    get anuncio_url(@anuncio), as: :json
    assert_response :success
  end

  test "should update anuncio" do
    debugger
    patch anuncio_url(@anuncio), params: { anuncio: { limiteinferior: @anuncio.limiteinferior, margenflotante: @anuncio.margenflotante, maximotiempo: @anuncio.maximotiempo, ton: @anuncio.ton, usuario_id: @anuncio.usuario_id } }, as: :json
    assert_response :success
  end

  test "should destroy anuncio" do
    debugger
    assert_difference("Anuncio.count", -1) do
      delete anuncio_url(@anuncio), as: :json
    end

    assert_response :no_content
  end
end
