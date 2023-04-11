require "test_helper"

class AnunciosventaControllerTest < ActionDispatch::IntegrationTest
  def crear_token_autorizacion_prueba
    secreto = ENV.fetch('HS256_SECRET')
    carga = { data: 'test' }
    token = JWT.encode carga, secreto, 'HS256'
    return token
  end

  setup do
    #debugger
    #@anuncioventa = anuncioventa()
  end

  test "should get index" do
    token = crear_token_autorizacion_prueba
    get anunciosventa_url, as: :json, params: {},
      headers: { HTTP_AUTHORIZATION: "Bearer #{token}" }
    # No está haciendolo
    assert_response :success
  end

  test "should create anuncioventa" do
    skip
    debugger
    assert_difference("Anuncioventa.count") do
      post anunciosventa_url, params: { 
        anuncioventa: { 
          limiteinferior: @anuncioventa.limiteinferior, 
          margenflotante: @anuncioventa.margenflotante, 
          maximotiempo: @anuncioventa.maximotiempo, 
          ton: @anuncioventa.ton, 
          usuario_id: @anuncioventa.usuario_id 
        } 
      }, as: :json
    end

    assert_response :created
  end

  test "should show anuncioventa" do
    skip
    debugger
    get anuncioventa_url(@anuncioventa), as: :json
    assert_response :success
  end

  test "should update anuncioventa" do
    skip
    debugger
    patch anuncioventa_url(@anuncioventa), params: { 
      anuncioventa: { 
        limiteinferior: @anuncioventa.limiteinferior, 
        margenflotante: @anuncioventa.margenflotante, 
        maximotiempo: @anuncioventa.maximotiempo, 
        ton: @anuncioventa.ton, 
        usuario_id: @anuncioventa.usuario_id 
      } 
    }, as: :json
    assert_response :success
  end

  test "should destroy anuncioventa" do
    skip
    debugger
    assert_difference("Anuncioventa.count", -1) do
      delete anuncioventa_url(@anuncioventa), as: :json
    end

    assert_response :no_content
  end
end
